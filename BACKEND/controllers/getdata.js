const User = require('../models/user.js')
const Message =  require('../models/message.js')
const getusers = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        let user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};


const sendlink = async (req,res)=>{
    const r = req.file.path;
    console.log(r);
    res.json(r);
}

const sendmesssage = async (req,res)=>{
    const { senderId, receiverId } = req.query;

    const message  = await Message.find({
        $or:[
            {senderId : senderId , receiverId :receiverId},
            {senderId : receiverId , receiverId :senderId }
        ],
    }).sort({ createdAt: 1 })

    res.json(message);
}
module.exports = {getusers,sendlink,sendmesssage}