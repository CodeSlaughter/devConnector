const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load profile model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//@route    GET api/profile/test
//@desc     Tests profile route
//@acess    Public
router.get('/test', (req, res) => {
    res.json({ msg: 'profile works' });
})

//@route    GET api/profile
//@desc     Get current users profile
//@acess    Private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name' , 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@route    GET api/profile/all
//@desc     Get all profiles
//@acess    Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if (!profiles) {
            errors.noProfiles = 'There are no profiles';
            res.status(404).json(errors)
        } else {
            res.json(profiles)
        }
    })
    .catch(er => res.status(404).json({npProfiles: 'There are no profiles'}));
});


//@route    GET api/profile/handle/:handle
//@desc     Get profile by handle
//@acess    Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if (!profile) {
            errors.noProfile = 'There is no profile for this user';
            res.status(404).json(errors)
        } else {
            res.json(profile)
        }
    })
    .catch(err => console.log(err));
});

//@route    GET api/profile/user/:user_id
//@desc     Get profile by user ID
//@acess    Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if (!profile) {
            errors.noProfile = 'There is no profile for this user';
            res.status(404).json(errors)
        } else {
            res.json(profile)
        }
    })
    .catch(er => res.status(404).json({npProfile: 'There is no profile for this user'}));
});

//@route    POST api/profile
//@desc     Create user profile
//@acess    Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //check validation
    if (!isValid) {
        // return any errors with 400 status
        return res.status(400).json(errors);
    }

    //get fields
    const profileFields = {};
    profileFields.user = req.user.id
    if (req.body.handle) {
        profileFields.handle = req.body.handle;
    }
    if (req.body.company) {
        profileFields.company = req.body.company;
    }
    if (req.body.website) {
        profileFields.website = req.body.website;
    }
    if (req.body.location) {
        profileFields.location = req.body.location;
    }
    if (req.body.bio) {
        profileFields.bio = req.body.bio;
    }
    if (req.body.status) {
        profileFields.status = req.body.status;
    }
    if (req.body.githubusername) {
        profileFields.githubusername = req.body.githubusername;
    }
    //skills split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',')
    }

    //Social
    profileFields.social = {};
    if (req.body.youtube) {
        profileFields.social.youtube = req.body.youtube;
    }
    if (req.body.twitter) {
        profileFields.social.twitter = req.body.twitter;
    }
    if (req.body.facebook) {
        profileFields.social.facebook = req.body.facebook;
    }
    if (req.body.linkedin) {
        profileFields.social.linkedin = req.body.linkedin;
    }
    if (req.body.instagram) {
        profileFields.social.instagram = req.body.instagram;
    }

    Profile.findOne({
        user: req.user.id
    })
        .then(profile => {
            if (profile) {
                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )
                    .then((profile) => {
                        res.json(profile)
                    })
                    .catch(err => console.log(err))
            } else {
                // create

                //check if handle exists
                Profile.findOne({ handle: profileFields.handle})
                .then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exists';
                        res.status(400).json(errors);
                    }
                    //save profile
                    new Profile(profileFields)
                    .save()
                    .then(profile => {
                        res.json(profile)
                    })
                    .catch(err => console.log(err))
                })
            }
        })
        .catch(err => console.log(err))
});

//@route    POST api/profile/experience
//@desc     Add experience to profle
//@acess    Private
router.post('/experience', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    
        //check validation
        if(!isValid){
            // return any errors with 400 status
            return res.status(400).json(errors);
        } 
    Profile.fineOne({ user: req.user.id })
    .then(profile => {
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description,
        }

        //add to experience array
        profile.experience.unshift(newExp);

        profile.save()
        .then(profile => {
            res.json(profile)
        })
        .catch(err => console.log(err))
    })
});

//@route    POST api/profile/education
//@desc     Add education to profle
//@acess    Private
router.post('/education', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    
        //check validation
        if(!isValid){
            // return any errors with 400 status
            return res.status(400).json(errors);
        } 
    Profile.fineOne({ user: req.user.id })
    .then(profile => {
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldOfStudy: req.body.fieldOfStudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description,
        }

        //add to education array
        profile.education.unshift(newEdu);

        profile.save()
        .then(profile => {
            res.json(profile)
        })
        .catch(err => console.log(err))
    })
});

//@route    DELETE api/profile/experience/:exp_id
//@desc     Remove experience from profle
//@acess    Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false}), (req, res) => {
    Profile.fineOne({ user: req.user.id })
    .then(profile => {
            //get remove index
        const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

        //splice out of array
        profile.experience.splice(removeIndex, 1)

        //save
        profile.save()
        .then(profile => res.json(profile))
        .catch(err => console.log(err))
    })
    .catch(err => res.status(404).json(err));
});

//@route    DELETE api/profile/education/:edu_id
//@desc     Remove education from profle
//@acess    Private
router.delete('/education/:exp_id', passport.authenticate('jwt', { session: false}), (req, res) => {
    Profile.fineOne({ user: req.user.id })
    .then(profile => {
            //get remove index
        const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

        //splice out of array
        profile.education.splice(removeIndex, 1)

        //save
        profile.save()
        .then(profile => res.json(profile))
        .catch(err => console.log(err))
    })
    .catch(err => res.status(404).json(err));
});

//@route    DELETE api/profile
//@desc     Delete user and profile
//@acess    Private
router.delete('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    Profile.fineOneAndRemove({ user: req.user.id })
    .then(() => {
        User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }))
    })
    .catch(err => console.log(err));
});

module.exports = router;
