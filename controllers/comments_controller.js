const Comment = require('../models/comment');
const Post = require('../models/post');

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
      return res.redirect('back');
    }
  } catch (err) {
    console.log('Error', err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postID = comment.post;

      await comment.remove();

      await Post.findByIdAndUpdate(postID, {
        $pull: { comments: req.params.id },
      });

      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch {
    console.log('Error', err);
    return;
  }
};
