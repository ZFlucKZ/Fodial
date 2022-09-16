const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const { isErrored } = require('stream');

//* tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID:
        '772661374380-a7t8upvrihgtob1e6s1c9eor7rfiepf6.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8000/users/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // console.log(profile);
      //* find a user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log('Eror in google strategy-passport', err);
          return;
        }

        if (user) {
          //* if found, set this user as req.user
          return done(null, user);
        } else {
          //* if not found, create the user ans set it req.user
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString('hex'),
            },
            function (err, user) {
              if (err) {
                console.log(
                  'Error in creating user google strategy-passport',
                  err
                );
                return;
              }
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
