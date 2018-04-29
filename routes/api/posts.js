const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load model
const Post = require('../../models/Post');

//Load Validation
const validatePostInput = require('../../validation/post');

//@route    GET api/posts/test
//@desc     Tests posts route
//@acess    Public
router.get('/test', (req, res) => {
    res.json({msg: 'post works'})
})

//@route    POST api/posts
//@desc     Create Post
//@acess    Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
        // return any errors with 400 status
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    })
    newPost.save()
    .then(post => {
        res.json(post);
    })
    .catch(err => console.log(err))
});

module.exports = router;