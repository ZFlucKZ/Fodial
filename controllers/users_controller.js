const User = require('../models/user');
const fs = require('fs');
const path = require('path');

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

module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Susccessfully');
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
