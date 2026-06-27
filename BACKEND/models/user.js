const mongoose  =  require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true
    },
    profilepic:{
        type:String,
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User",userSchema);

module.exports = User;
