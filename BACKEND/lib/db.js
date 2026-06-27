require('dotenv').config()
const mongoose = require("mongoose")



const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
        console.log("DATABASE IS CONNECTED");
    }catch(err){
        console.log("the error is :: "+err);
    }

}

module.exports = connectDB;