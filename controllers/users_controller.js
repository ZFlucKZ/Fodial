const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const resetMailer = require('../mailers/reset_password');
const { transporter } = require('../config/nodemailer');

module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);

    return res.render('user_profile', {
      title: 'User Profile',
      profile_user: user,
    });
  } catch (err) {
    console.log('Error', err);
    return;
  }
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        console.log('uploadAvatar');
        if (err) {
          console.log('********Multer Error', err);
        }

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            console.log('if req.file if user.avatar block');
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }

          console.log('if req.file block');
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        console.log('success');
        user.save();
        return res.redirect('back');
      });
    } catch (err) {
      console.log('error');
      req.flash('error', err);
      return res.redirect('back');
    }
  } else {
    req.flash('error', 'Unauthorized');
    return res.status(401).send('Unauthorized');
  }
};

//* get the sign up data *//
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect('back');
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log('Error in finding user in signing up');
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log('Error in creating user while signing up');
        }

        return res.redirect('back');
      });
    }
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/users/profile');
  }

  return res.render('user_sign_in', {
    title: 'Fodial | Sign In',
  });
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/users/profile');
  }

  return res.render('user_sign_up', {
    title: 'Fodial | Sign Up',
  });
};

module.exports.forgotPassword = function (req, res) {
  return res.render('forgot_password', {
    title: 'Fodial | forgot password',
  });
};

module.exports.sendLinkReset = function (req, res) {
  const email = req.body.email;
  // console.log('Email : ' + email);

  let user = User.findOne({ email: email });
  // console.log(user);
  if (!user) {
    console.log('User does not exists.');
    req.flash('success', 'Email Sent!');
    return res.redirect('/');
  }

  const token = jwt.sign({ _id: user._id }, 'fodial_resetpassword', {
    expiresIn: '600000',
  });
  // console.log(token.length);

  return user.updateOne({ resetLink: token }, (err, user) => {
    if (err) {
      return res.status(400).json({ error: 'reset password link error' });
    }

    resetMailer.resetPassword(email, token);
    req.flash('success', 'Email Sent!');
    return res.redirect('/');
  });
};

module.exports.resetPassword = function (req, res) {
  const token = req.params.token;
  console.log(token);

  return res.render('reset_password', {
    title: 'Fodial | Reset password',
    token: token,
  });
};

module.exports.updatePassword = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash('error', 'Password does not same');
    return res.redirect('back');
  }

  const token = req.body.token.trim();
  const password = req.body.password;
  // console.log(token);
  // console.log(token.length);
  // console.log(password);

  // const something = jwt.verify(token, 'fodial_resetpassword');
  // console.log(something);

  if (token) {
    jwt.verify(token, 'fodial_resetpassword', function (err, decodedData) {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Incorrect token or it is expired' });
      }

      User.findOne({ resetLink: token }, (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: 'User with this token does not exist' });
        }

        user.password = password;
        user.resetLink = '';
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({ error: 'Reset Password Error' });
          } else {
            req.logout(function (err) {
              if (err) {
                console.log(err);
              }
            });
            req.flash('success', 'Password has been changed');
            res.redirect('/');
          }
        });
      });
    });
  } else {
    return res.status(401).json({ error: 'Authentication Error' });
  }
};

module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect('/');
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
  });
  req.flash('success', 'You have logged out!');

  res.redirect('/');
};
