const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

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
    const { errors, isValid } = validateRegisterInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors)
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

    const { errors, isValid } = validateLoginInput(req.body);
    
        //check validation
        if (!isValid) {
            return res.status(400).json(errors)
        }

    //Find User by email
    User.findOne({email})
        .then(user => {
            if (!user){
                errors.email = 'User not found';
                return res.status(404).json(errors)
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
                        errors.password = 'Password incorrect'
                        return res.status(400).json(errors)
                    }
                })
                .catch(err => console.log(err))
        })
})

//@route    GET api/users/current
//@desc     return current user
//@acess    Private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user)
})

module.exports = router;
