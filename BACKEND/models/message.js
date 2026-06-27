const mongoose  =  require('mongoose');
const User = require('./user.js');

const messageSchema = new mongoose.Schema({
    receiverId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true
    },

    senderId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true
    },

    text:{
        type:String
    },
    image:{
        type:String
    }
},
{timestamps:true}
);

const Message = new mongoose.model("Message",messageSchema);

module.exports = Message;