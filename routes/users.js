const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt=require('jsonwebtoken');
const config = require('../config/database');

//register page
router.post('/register', (req,res,next) => {
  let newUser = new User({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username,
    password:req.body.password
  });

  User.addUser(newUser, (err,user)=>{
    if(err){
      res.json({success:false,msg:'Registration failed'});
    }else{
      res.json({success:true,msg:'Registration successful'});
    }
  });
});

//authenticte page
router.post('/authenticate', (req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;
  //getting a user through his input to the login
  User.getUserByUsername(username,(err,user)=>{
    if (err)throw err;
    if (!user){
      return res.json({success:false,msg:'User not found'});
    }
    //comparing between the password that the user entered and the hashed password we have,.
    User.comparePassword(password,user.password, (err,isMatch)=>{
      if (err)throw err;
      if (isMatch){       //login successfull
        const token = jwt.sign(user,config.secret,{
          expiresIn:604800 //1 week
        });
        res.json({
          success:true,
          token: 'JWT '+token,
          user:{
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }

        });
      }else{
        return res.json({success: false,msg:' Wrong Password'});

      }
    });
  });
});

//profile page
router.get('/profile', passport.authenticate('jwt' , {session:false}), (req,res,next) => {
  res.json({user:req.user});    
});

module.exports = router;
