'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./user.model');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

// view passport docs, similar config structure
passport.use(new LocalStrategy ({
    usernameField: 'email'
  },
  (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) throw err;

      if (user) {
        user.authenticate(password, (err, successful) => {
          if (err) throw err;

          if (successful) {
            done(null, user);
            console.log(user);
          } else {
            done(null, null);
          }
        });
      } else {
        done(null, null);
      }
    });
  })
);


// below is same code as above ln 16
// passport.deserializeUser(function(id, done) {
//   User.findById(id, done(err, user));
// });
// // below is same code as above ^^^^
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
