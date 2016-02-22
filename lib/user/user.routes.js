'use strict';

const express = require('express');
const router = express.Router();
const User = require('./user.model.js')

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if(err) throw err;
    req.session.user = user;
    res.redirect('/');
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

// If the passwords do NOT match, redirect to login and send message
// If the passwords DO match, use the User model schema and mongo fincOne()
// to look for the req.body.email. If the email exists, redirect to login.
// If the the req.body.email does NOT exist, create the user and redirect to login.
router.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;

      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err) => {
          if(err) throw err;

          res.redirect('/login');
        });
      }
    });
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
});

module.exports = router;
