const express = require('express');
const passport = require('passport');

const router = express.Router();
const usersController = require('../controllers/users_controller');

router.get(
  '/profile/:id',
  passport.checkAuthentication,
  usersController.profile
);

router.post(
  '/update/:id',
  passport.checkAuthentication,
  usersController.update
);

router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);

router.post('/create', usersController.create);

//* use passport as a middleware to authenticate
router.post(
  '/create-session',
  passport.authenticate('local', { failureRedirect: '/users/sign-in' }),
  usersController.createSession
);

router.get('/sign-out', usersController.destroySession);

router.get('/forgot_password', usersController.forgotPassword);
router.post('/forgot_password_sendemail', usersController.sendLinkReset);
router.get('/resetpassword/:token', usersController.resetPassword);
router.post('/updatepassword', usersController.updatePassword);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/sign-in' }),
  usersController.createSession
);

module.exports = router;
