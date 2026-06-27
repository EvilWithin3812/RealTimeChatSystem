require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { Server } = require('socket.io');
const cloudinary = require('./cloudinary/cloudinary');
const User = require('./models/user');
const Message = require('./models/message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
});

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/realtimechatSystem';
const frontendDist = path.join(__dirname, '..', 'FRONTEND', 'vite-project', 'dist');

const activeUsers = new Map();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});
const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_NAME
    && process.env.CLOUDINARY_KEY
    && process.env.CLOUDINARY_SECRET,
);

const avatarDataUri = (label) => {
    const safeLabel = (label || 'U').trim().slice(0, 1).toUpperCase() || 'U';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1f2937"/>
            <stop offset="100%" stop-color="#374151"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" rx="80" fill="url(#g)"/>
        <circle cx="80" cy="62" r="28" fill="#f3f4f6"/>
        <path d="M30 138c10-28 31-42 50-42s40 14 50 42" fill="#f3f4f6"/>
        <text x="80" y="103" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#111827">${safeLabel}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const toPublicUser = (user) => {
    if (!user) {
        return null;
    }

    return {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        profilepic: user.profilepic,
    };
};

const uploadBufferToCloudinary = (file, folder) => new Promise((resolve, reject) => {
    if (!file) {
        return resolve(null);
    }

    if (!hasCloudinaryConfig) {
        return reject(new Error('Cloudinary is not configured'));
    }

    const stream = cloudinary.uploader.upload_stream(
        {
            folder,
            resource_type: 'image',
        },
        (error, result) => {
            if (error) {
                return reject(error);
            }

            return resolve(result.secure_url);
        },
    );

    stream.end(file.buffer);
});

const sessionMiddleware = session({
    secret: process.env.secretcode || 'local-chat-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    User.findById(req.session.userId)
        .then((currentUser) => {
            if (!currentUser) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            req.currentUser = currentUser;
            return next();
        })
        .catch((err) => {
            console.error('Auth lookup failed:', err);
            return res.status(500).json({ error: 'Failed to verify user' });
        });
};

const registerRoutes = (basePath) => {
    app.post(`${basePath}/signup`, upload.single('profilepic'), async (req, res) => {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: 'username, email, and password are required' });
        }

        try {
            const duplicate = await User.findOne({
                $or: [
                    { username: new RegExp(`^${String(username).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                    { email: new RegExp(`^${String(email).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                ],
            });
            if (duplicate) {
                return res.status(409).json({ error: 'A user with that username or email already exists' });
            }

            let profilepic = avatarDataUri(username);

            if (req.file) {
                try {
                    profilepic = await uploadBufferToCloudinary(req.file, 'realtimepictures/profile');
                } catch (uploadError) {
                    console.error('Profile image upload failed:', uploadError.message || uploadError);
                    profilepic = avatarDataUri(username);
                }
            }

            const user = new User({
                username,
                email,
                profilepic,
            });

            const registeredUser = await User.register(user, password);
            req.session.userId = registeredUser._id.toString();
            return res.status(200).json(toPublicUser(registeredUser));
        } catch (err) {
            console.error('Signup failed:', err);
            return res.status(400).json({ error: err.message || 'Failed to create account' });
        }
    });

    app.post(`${basePath}/login`, (req, res) => {
        const { username, password } = req.body;

        User.authenticate()(username, password, (err, user) => {
            if (err) {
                console.error('Login failed:', err);
                return res.status(500).json({ error: 'Failed to log in' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            req.session.userId = user._id.toString();
            return res.status(200).json(toPublicUser(user));
        });
    });

    app.post(`${basePath}/logout`, (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to log out' });
            }

            res.clearCookie('connect.sid');
            return res.sendStatus(200);
        });
    });

    app.get(`${basePath}/allusers`, async (_req, res) => {
        try {
            const users = await User.find().sort({ username: 1 });
            return res.json(users.map(toPublicUser));
        } catch (err) {
            console.error('Failed to fetch users:', err);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
    });

    app.get(`${basePath}/getuser`, requireAuth, (req, res) => {
        return res.json(toPublicUser(req.currentUser));
    });

    app.post(`${basePath}/uploads`, upload.single('msgpic'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const imageUrl = await uploadBufferToCloudinary(req.file, 'realtimepictures/messages');
            return res.json(imageUrl);
        } catch (uploadError) {
            console.error('Message image upload failed:', uploadError.message || uploadError);
            return res.status(400).json({
                error: 'Message image upload failed. Check your Cloudinary credentials.',
            });
        }
    });

    app.get(`${basePath}/message`, async (req, res) => {
        const { senderId, receiverId } = req.query;

        try {
            const conversation = await Message.find({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            }).sort({ createdAt: 1 });

            return res.json(conversation);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
    });
};

registerRoutes('/api/user');

io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on('user-connected', (userId) => {
        if (!userId) {
            return;
        }

        activeUsers.set(String(userId), socket.id);
        io.emit('update-users', Object.fromEntries(activeUsers));
    });

    socket.on('sendmessage', async (data) => {
        const { messageData } = data || {};

        if (!messageData) {
            return;
        }

        try {
            const newMessage = await Message.create({
                senderId: messageData.senderId,
                receiverId: messageData.receiverId,
                text: messageData.text || '',
                image: messageData.image || '',
            });

            const receiverSocketId = activeUsers.get(String(messageData.receiverId));
            if (receiverSocketId) {
                socket.to(receiverSocketId).emit('receivemessage', newMessage);
            }
        } catch (err) {
            console.error('Failed to save message:', err);
            socket.emit('message-error', { error: 'Failed to save message' });
        }
    });

    socket.on('call-user', ({ to, from, offer, type }) => {
        const receiverSocketId = activeUsers.get(String(to));
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit('incoming-call', { from, offer, type });
        } else {
            socket.emit('call-unavailable', { to });
        }
    });

    socket.on('answer-call', ({ to, from, answer }) => {
        const receiverSocketId = activeUsers.get(String(to));
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit('call-accepted', { from, answer });
        }
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
        const receiverSocketId = activeUsers.get(String(to));
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit('ice-candidate', { candidate });
        }
    });

    socket.on('reject-call', ({ to }) => {
        const receiverSocketId = activeUsers.get(String(to));
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit('call-rejected');
        }
    });

    socket.on('end-call', ({ to }) => {
        const receiverSocketId = activeUsers.get(String(to));
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit('call-ended');
        }
    });

    socket.on('disconnect', () => {
        for (const [userId, socketId] of activeUsers.entries()) {
            if (socketId === socket.id) {
                activeUsers.delete(userId);
                break;
            }
        }

        console.log(`user disconnected ${socket.id}`);
        io.emit('update-users', Object.fromEntries(activeUsers));
    });
});

app.use(express.static(frontendDist));

const spaHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Real Time Chat</title>
    <link rel="stylesheet" href="/app.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/app.js"></script>
  </body>
</html>`;

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        return next();
    }

    return res.type('html').send(spaHtml);
});

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log('MongoDB is connected');
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        console.error(`Set MONGO_URL in BACKEND/.env or start MongoDB at ${MONGO_URL}`);
        process.exit(1);
    });
