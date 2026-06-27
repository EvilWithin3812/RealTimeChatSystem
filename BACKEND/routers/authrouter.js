const express  =  require('express')
const Router = express.Router();
const upload = require('../cloudinary/storage')
const {signup , login,logout,allusers} = require('../controllers/user.controllers')
const {getusers ,sendlink,sendmesssage} = require('../controllers/getdata')




Router.post('/signup', upload.single('profilepic'),signup);
Router.post('/login',login);
Router.post('/logout',logout);
Router.get('/allusers',allusers);
Router.get('/getuser',getusers)
Router.post('/uploads',upload.single('msgpic'),sendlink)
Router.get('/message',sendmesssage)

module.exports = Router;