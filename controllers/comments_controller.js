const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function (req, res) {
  // console.log('Post ID : ' + id);
  const postID = req.body.post.trim();

  Post.findById(postID, function (err, post) {
    console.log('Post : ' + post);
    if (err) {
      console.log('Error in find a post on creating a comment');
      return;
    }

    if (post) {
      Comment.create(
        {
          content: req.body.content,
          user: req.user._id,
          post: postID,
        },
        function (err, comment) {
          //* handle error
          if (err) {
            console.log('Error in creating a comment');
            return;
          }

          // console.log('Comment Created');
          post.comments.push(comment);
          post.save();
          return res.redirect('back');
        }
      );
    }
  });
};

module.exports.destroy = function (req, res) {
  Comment.findById(req.params.id, function (err, comment) {
    if (comment.user == req.user.id) {
      let postID = comment.post;

      comment.remove();

      Post.findByIdAndUpdate(
        postID,
        { $pull: { comments: req.params.id } },
        function (err, post) {
          return res.redirect('back');
        }
      );
    } else {
      return res.redirect('back');
    }
  });
};
