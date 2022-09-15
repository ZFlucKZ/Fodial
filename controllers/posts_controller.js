const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    let username = await User.findById(post.user);

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post,
          user: username.name,
        },
        message: 'Post created!',
      });
    }

    req.flash('success', 'Post published');
    return res.redirect('back');
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};

module.exports.destroy = async function (req, res) {
  // console.log(req.params.id);
  try {
    let post = await Post.findById(req.params.id);

    if (post.user == req.user.id) {
      post.remove();

      await Comment.deleteMany({ post: req.params.id });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: 'Post deleted!',
        });
      }

      req.flash('success', 'Post and associated comments deleted!');
      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};
