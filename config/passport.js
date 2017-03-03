const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/database');
const User = require('../models/user');


module.exports=function(passport){
  let opts={};
    opts.jwtFromRequest=ExtractJwt.fromAuthHeader();
    opts.secretOrKey=config.secret;
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
                                //making sure it has the correct id
      User.getUserById(jwt_payload._doc._id,(err,user)=>{
        if (err){
          return done(err,false);

        }
        if (user){
          return done(null,user);

        }else{
          return done(null,false);
        }
      });
    }));

}
