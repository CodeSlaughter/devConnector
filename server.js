const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//db config
const db = process.env.MONGOURI || require('./config/keys').mongoURI;

//connect to mongodb
mongoose.connect(db)
    .then(() => {
        console.log('mongodb connected');
    })
    .catch(err => console.log(err));
//Passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

//use routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);


const port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})