const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailers');

module.exports.create = async function (req, res) {
  // console.log('Post ID : ' + id);
  try {
    const postID = await req.body.post.trim();
    let post = await Post.findById(postID);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        post: postID,
      });

      post.comments.push(comment);
      post.save();
      // console.log(comment);
      comment = await comment.populate('user', 'name email');
      // commentsMailer.newComment(comment);
      // console.log('2', comment);
      console.log(req.xhr);

      if (req.xhr) {
        console.log('4');
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: 'Post created!',
        });
      }
      req.flash('success', 'Comment published!');
      res.redirect('/');
    }
  } catch (err) {
    console.log('Error');
    req.flash('error', err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postID = comment.post;

      await comment.remove();

      let post = await Post.findByIdAndUpdate(postID, {
        $pull: { comments: req.params.id },
      });

      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: 'Post deleted',
        });
      }

      req.flash('success', 'Comment deleted!');

      return res.redirect('back');
    } else {
      req.flash('error', 'Unauthorized');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err);
    return;
  }
};
