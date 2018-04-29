const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load model
const Post = require('../../models/Post');
const User = require('../../models/User');

//Load Validation
const validatePostInput = require('../../validation/post');

//@route    GET api/posts/test
//@desc     Tests posts route
//@acess    Public
router.get('/test', (req, res) => {
    res.json({msg: 'post works'})
})

//@route    Get api/posts
//@desc     Get Posts
//@acess    Public
router.get('/', (req, res) => {
    Post.find()
    .sort({ date: 'desc' })
    .then(posts => res.json(posts))
    .catch(() => res.status(404).json({ noPostsFound: 'No posts found' }))
});

//@route    Get api/posts/:id
//@desc     Get Posts by id
//@acess    Public
router.get('/:id', (req, res) => {
    Post.find()
    .then(post => res.json(post))
    .catch(() => res.status(404).json({ noPostFound: 'No post found with that id' }))
});

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

//@route    DELETE api/posts/:id
//@desc     Delete Post
//@acess    Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user:  req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            //Check for post owner
            if (post.user.toString() !== req.user.id){
                return res.status(401).json({ notAuthorized: 'User not authorized' })
            }
            post.remove()
            .then(() => {
                res.json({ sucess: true })
            })
            .catch(() => res.status(404).json({ postNotFound: 'Post not found' }))
        })
    })
    .catch(() => res.status(404).json({ userNotFound: 'user not found'}))
});

module.exports = router;