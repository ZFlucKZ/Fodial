const User = require('../models/user');

module.exports.profile = function (req, res) {
  if (req.cookies.user_id) {
    User.findById(req.cookies.user_id, function (err, user) {
      if (user) {
        return res.render('user_profile', {
          title: 'User Profile',
          user: user,
        });
      }
      return res.redirect('/users/sign-in');
    });
  } else {
    return res.redirect('/users/sign-in');
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

module.exports.createSession = function (req, res) {
  //* steps to authenticate
  // find the user
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log('Error in finding user on create session');
      return;
    }
    // handle user found
    if (user) {
      // handle password which don't match
      if (user.password != req.body.password) {
        return res.redirect('back');
      }
      // handle session creation
      res.cookie('user_id', user.id);
      return res.redirect('/users/profile');
    } else {
      // handle user not found
      return res.redirect('back');
    }
  });
};

module.exports.signIn = function (req, res) {
  //TODO later
};

module.exports.signUp = function (req, res) {
  //TODO later
};
