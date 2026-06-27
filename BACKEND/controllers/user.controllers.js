const User = require('../models/user.js')
const passport = require('passport')

const signup = async (req,res)=>{
    try{

        const {email,username,password} = req.body;
        const profilepic = req.file ? req.file.path : null;

        console.log(email  + " .." + " .. "+username +" .. "+profilepic)
        const newuser = new User({username,email,profilepic});
        const result = await User.register(newuser,password); 
        
        req.login(result, (err) => {
            if (err) {
                console.error("Login error:", err); // Log the error for debugging
                return res.status(500).send("Login failed: " + err);
            }
            return res.status(200).send("User registered and logged in successfully");
        });
    }catch(err){
        return res.status(400).send("THE ERROR IS : "+err);
    }
}



const login = (req, res) => {
    try{
        passport.authenticate('local', { failureRedirect: '/login' })(req, res, function() {
            return res.status(200).send("You are successfully logged in .");
          });
    }catch(err){
        return res.status(500).send("error is "+err);
    }
  };
  



const logout = (req, res, next) => {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
      }
      res.redirect('/');
    });
};


const allusers = async (req,res)=>{
    const Users = await User.find();
    res.json(Users);
}

module.exports = { signup, login, logout ,allusers};