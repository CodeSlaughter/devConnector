const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const secret = process.env.SECRET || require('../../config/keys').secretOrKey

//load user models
const User = require('../../models/User')

//@route    GET api/users/test
//@desc     Tests users route
//@acess    Public
router.get('/test', (req, res) => {
    res.json({msg: 'user works'})
})

//@route    GET api/users/register
//@desc     Register User
//@acess    Public
router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'Email already exists'})
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: 200, //size
                    r: 'pg', //rating
                    d: 'mm' //default
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (er, salt) => {
                    bcrypt.hash(newUser.password, salt, (er, hash) => {
                        if (er) throw er;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })    
});
//@route    GET api/users/login
//@desc     Login User / returning jwt token
//@acess    Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find User by email
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json({email: 'User not found'})
            }

            //check password
            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch){
                        //user matched

                        //create jwt payload
                        const payload = {
                            id: user.id, 
                            name: user.name,
                            avatar: user.avatar
                        }
                        jwt.sign(
                            payload, 
                            secret, 
                            { expiresIn: 3600 }, 
                            (er, token) => {
                                res.json({
                                    sucess: true,
                                    token: 'Bearer ' + token
                            })
                        })
                    } else {
                        return res.status(400).json({password: 'password incorrect'})
                    }
                })
                .catch(err => console.log(err))
        })
})

module.exports = router;
