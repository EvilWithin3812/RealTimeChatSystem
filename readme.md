# 🚀 Real-Time Chat System

A full-stack real-time messaging application built with the **MERN Stack** (MongoDB, Express, React, Node.js) that enables users to communicate instantly with real-time updates using **Socket.io**.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Socket Events](#socket-events)
- [Usage Guide](#usage-guide)
- [File Upload Configuration](#file-upload-configuration)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 📖 Project Overview

**Real-Time Chat System** is a modern chat application that allows multiple users to communicate instantly. The application features:

- **Real-time messaging** with instant message delivery
- **User authentication** with secure login and registration
- **Online user tracking** to see who's currently active
- **Persistent chat history** stored in MongoDB
- **Image sharing** capability with Cloudinary integration
- **User profiles** with custom profile pictures
- **Responsive UI** with a clean and modern interface

This is a perfect example of how to build a scalable real-time communication system using modern web technologies.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3** - UI library for building user interfaces
- **Vite 6.0** - Lightning-fast build tool
- **Socket.io-client 4.8** - Real-time bidirectional communication
- **React Router DOM 7.0** - Client-side routing
- **Axios 1.7** - HTTP client for API requests
- **Emoji Picker React 4.12** - Emoji selection component
- **React Icons 5.4** - Icon library
- **CSS3** - Styling and responsive design

### **Backend**
- **Node.js 23.4** - JavaScript runtime
- **Express.js 4.21** - Web framework
- **Socket.io 4.8** - Real-time event-driven architecture
- **MongoDB** - NoSQL database
- **Mongoose 8.9** - MongoDB ODM (Object Document Mapper)
- **Passport.js 0.7** - Authentication middleware
- **Express-session 1.18** - Session management
- **Connect-mongo 5.1** - MongoDB session store
- **Multer 1.4** - File upload handling
- **Cloudinary 1.41** - Cloud image storage
- **Multer-storage-cloudinary 4.0** - Cloudinary storage for Multer
- **Dotenv 16.4** - Environment variable management
- **Nodemon 3.1** - Development server auto-reload

---

## ✨ Features

### **User Authentication**
- 🔐 Secure user registration with email and username
- 🔐 Login/logout functionality
- 🔐 Password encryption using Passport.js with salt and hash
- 👤 Profile picture upload during signup
- 📧 Email-based user identification

### **Real-Time Messaging**
- ⚡ Instant message delivery using Socket.io
- 💬 One-to-one messaging between users
- 📱 Bidirectional real-time communication
- 🔄 Auto-scroll to latest messages
- ⏰ Timestamps on all messages

### **User Management**
- 👥 View all registered users
- 🟢 See online/offline status in real-time
- 👤 View user profiles with profile pictures
- 🔄 Automatic online status updates

### **File Sharing**
- 🖼️ Share images in messages
- ☁️ Cloud storage using Cloudinary
- 📤 Drag-and-drop file upload
- 🎨 Image preview in chat

### **User Interface**
- 🎨 Clean and modern design
- 📱 Fully responsive layout (mobile, tablet, desktop)
- 🌙 Dark/Light mode toggle
- ⌨️ Emoji picker for expressive messaging
- 🎯 Intuitive user experience

### **Session Management**
- 🔑 Express-session for secure sessions
- 💾 MongoDB-backed session persistence
- 🛡️ CORS enabled for security

---

## 📁 Project Structure

```
RealTimeChatSystem/
│
├── BACKEND/                          # Node.js Express server
│   ├── index.js                      # Main server file
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment variables template
│   │
│   ├── models/
│   │   ├── user.js                   # User schema (username, email, password, profile pic)
│   │   └── message.js                # Message schema (sender, receiver, text, image, timestamps)
│   │
│   ├── controllers/
│   │   ├── user.controllers.js       # Signup, login, logout, get all users
│   │   └── getdata.js                # Fetch messages between users
│   │
│   ├── routers/
│   │   └── authrouter.js             # Authentication routes
│   │
│   ├── lib/
│   │   └── db.js                     # Database connection setup
│   │
│   ├── cloudinary/
│   │   ├── cloudinary.js             # Cloudinary configuration
│   │   └── storage.js                # Multer storage setup for Cloudinary
│   │
│   └── uploads/                      # Local upload directory (if needed)
│
├── FRONTEND/
│   └── vite-project/                 # React Vite application
│       ├── package.json              # Frontend dependencies
│       ├── vite.config.js            # Vite configuration
│       ├── index.html                # HTML entry point
│       │
│       ├── src/
│       │   ├── main.jsx              # React entry point
│       │   ├── App.jsx               # Main app component
│       │   ├── App.css               # Global styles
│       │   ├── index.css             # Global CSS
│       │   │
│       │   ├── pages/
│       │   │   ├── home.jsx          # Chat interface page
│       │   │   ├── login.jsx         # Login page
│       │   │   ├── signup.jsx        # Signup page
│       │   │   └── socket.jsx        # Socket.io configuration
│       │   │
│       │   └── components/
│       │       ├── navbar/
│       │       │   ├── navbar.jsx    # Navigation bar
│       │       │   └── navbar.css
│       │       │
│       │       ├── login/
│       │       │   ├── login.jsx
│       │       │   └── login.css
│       │       │
│       │       ├── signup/
│       │       │   ├── signup.jsx
│       │       │   └── signup.css
│       │       │
│       │       └── home/
│       │           ├── LEFTPART.jsx  # User list sidebar
│       │           ├── RIGHTPART.jsx # Chat messages area
│       │           ├── empty.jsx     # Empty state when no user selected
│       │           └── home.css
│       │
│       ├── public/                   # Static assets
│       └── dist/                     # Production build output
│
├── README.md                         # This file
└── .gitignore                        # Git ignore rules

```

---

## 🔧 Installation & Setup

### **Prerequisites**

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **Git** - [Download](https://git-scm.com/)

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/EvilWithin3812/RealTimeChatSystem.git
cd RealTimeChatSystem
```

### **Step 2: Backend Setup**

Navigate to the backend directory and install dependencies:

```bash
cd BACKEND
npm install
```

Create a `.env` file in the `BACKEND` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration (see [Environment Variables](#environment-variables) below).

### **Step 3: Frontend Setup**

Navigate to the frontend directory and install dependencies:

```bash
cd ../FRONTEND/vite-project
npm install
```

### **Step 4: Verify MongoDB Connection**

Ensure MongoDB is running:

- **Local MongoDB**: 
  ```bash
  mongod
  ```
  
- **MongoDB Atlas** (Cloud): Create a cluster and get your connection string

---

## 🚀 Running the Application

### **Start Backend Server**

From the `BACKEND` directory:

```bash
npm run dev
```

The backend server will start on `http://localhost:3000`

You'll see:
```
[nodemon] starting
Server is running on port 3000
Database connected successfully
```

### **Start Frontend Development Server**

From the `FRONTEND/vite-project` directory:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port)

You'll see:
```
VITE v6.0.1  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### **Building for Production**

**Frontend Build:**
```bash
cd FRONTEND/vite-project
npm run build
npm run preview
```

**Backend** is production-ready. Just set `NODE_ENV=production` in `.env`

---

## ⚙️ Environment Variables

Create a `.env` file in the `BACKEND` directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGO_URL=mongodb://localhost:27017/realtimechatSystem
# OR for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/realtimechatSystem

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Session Configuration
SESSION_SECRET=your_session_secret_key
```

### **How to Get Cloudinary Credentials:**

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your **Cloud Name**, **API Key**, and **API Secret**
4. Add them to your `.env` file

### **How to Set Up MongoDB:**

**Option 1: Local MongoDB**
- Download and install MongoDB
- Default connection: `mongodb://localhost:27017/realtimechatSystem`

**Option 2: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env` as `MONGO_URL`

---

## 📡 API Endpoints

### **Authentication Routes** (`/auth`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | `{ username, email, password, profilepic }` |
| POST | `/auth/login` | Login user | `{ email, password }` |
| GET | `/auth/logout` | Logout user | - |

### **User Routes**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/allusers` | Get all registered users |

### **Message Routes**

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|---------------|
| GET | `/getdata` | Get messages between two users | `userId1`, `userId2` |

---

## 🔌 Socket Events

The application uses Socket.io for real-time communication. Here are the main events:

### **Client to Server Events**

```javascript
// User connects
socket.emit('user-connected', { userId, username, profilepic });

// Send message
socket.emit('message', {
  senderId,
  receiverId,
  text: 'Message content',
  image: 'image_url'
});

// User typing
socket.emit('typing', { fromUserId, toUserId });

// User disconnects
socket.emit('user-disconnected', userId);
```

### **Server to Client Events**

```javascript
// Receive message
socket.on('message', (messageData) => { ... });

// User comes online
socket.on('user-online', (userData) => { ... });

// User goes offline
socket.on('user-offline', (userId) => { ... });

// User is typing
socket.on('user-typing', (userData) => { ... });

// Receive previous messages
socket.on('messages-history', (messages) => { ... });
```

---

## 💬 Usage Guide

### **1. Create an Account**

- Navigate to the signup page
- Enter username, email, and password
- Upload a profile picture (optional)
- Click "Sign Up"

### **2. Login**

- Go to login page
- Enter your email and password
- Click "Login"

### **3. Send a Message**

- After login, you'll see the chat interface
- Select a user from the left sidebar
- Type your message in the input box
- Press Enter or click Send
- Message appears instantly on both screens

### **4. Share an Image**

- In the message input area, look for the attachment/image icon
- Click to select an image
- Image is uploaded to Cloudinary and shared as a message
- Recipient sees the image preview

### **5. See Online Users**

- Left sidebar shows all users
- Green indicator shows online users
- Click on a user to open chat
- Chat history loads automatically

### **6. Toggle Dark Mode**

- Look for the theme toggle in the navbar
- Click to switch between light and dark themes

---

## 📤 File Upload Configuration

### **Image Upload Flow**

1. **Client**: User selects image → Sent to backend via `/auth/signup` or message upload
2. **Backend**: Multer receives file → Uploads to Cloudinary
3. **Cloudinary**: Generates URL → Returns to backend
4. **Database**: URL stored in MongoDB
5. **Client**: Image displayed in chat

### **Supported Formats**
- JPG, PNG, GIF, WebP
- Max file size: 10 MB

### **Cloudinary Setup in Code**

```javascript
// BACKEND/cloudinary/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
```

---

## 🎯 Future Enhancements

- [ ] **Group Chats** - Create and manage group conversations
- [ ] **Message Encryption** - End-to-end encryption for privacy
- [ ] **Message Search** - Search through message history
- [ ] **User Blocking** - Block/unblock users
- [ ] **Voice/Video Calling** - WebRTC integration for calls
- [ ] **Message Reactions** - React to messages with emojis
- [ ] **Message Editing/Deletion** - Edit or delete sent messages
- [ ] **Mobile App** - React Native mobile version
- [ ] **Notifications** - Desktop and push notifications
- [ ] **Message Status** - Show read receipts
- [ ] **User Presence** - Last seen timestamp
- [ ] **Storage Optimization** - Message pagination/archiving

---

## 🔧 Troubleshooting

### **Issue: Cannot connect to MongoDB**

**Solution:**
- Ensure MongoDB is running (`mongod` for local)
- Check `MONGO_URL` in `.env` file
- Verify username/password for MongoDB Atlas
- Check network connectivity

### **Issue: Socket.io connection fails**

**Solution:**
- Check if backend is running on correct port
- Verify CORS settings in backend
- Clear browser cache and restart dev server
- Check browser console for errors

### **Issue: Cloudinary image upload fails**

**Solution:**
- Verify `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` in `.env`
- Ensure image size is under 10 MB
- Check Cloudinary dashboard for API activity
- Verify file format is supported

### **Issue: Port already in use**

**Solution:**
```bash
# For Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# For Mac/Linux
lsof -i :3000
kill -9 <PID>
```

Then change `PORT` in `.env` file.

### **Issue: npm install fails**

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📝 License

This project is open source and available under the **ISC License**.

---

## 👨‍💻 Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests.

---

## 📧 Contact

For questions or support, please reach out via:
- **GitHub Issues**: Open an issue in this repository
- **Email**: evilwithin3812@gmail.com

---

## 🙏 Acknowledgments

- **Socket.io** - Real-time communication library
- **MongoDB** - NoSQL database
- **Cloudinary** - Image hosting service
- **React & Vite** - Frontend framework and build tool
- **Express.js** - Backend framework

---

**Happy Coding! 🎉**

Feel free to star ⭐ this repository if you find it helpful!



