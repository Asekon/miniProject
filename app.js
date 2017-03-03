const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database);    //to connect to our database


//connection established
mongoose.connection.on('connected', () => {
  console.log('connected to '+config.database);
});

//connection error
mongoose.connection.on('error', (err) => {
  console.log('error: '+err);
});


const app=express();

const users=require('./routes/users');

//port-number
const port = 3000;

app.use(cors());

   // setting a static folder
app.use(express.static(path.join(__dirname, 'client')));

// Body  Parser Middleware
app.use(bodyParser.json());

//passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users',users);


app.get('/', (req,res) => {
  res.send('Invalid Endpoint');
});

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname,'client/index.html'));
})

//start server
app.listen(port, ()=> {
  console.log('server started on port '+port);
});
