// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);
    // console.log(this.newCommentForm);
    this.createComment(postId);

    let self = this;
    // call for all the existing comments
    $(' .delete-comment-button', this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      // console.log('createComment');
      let self = this;

      $.ajax({
        type: 'post',
        url: '/comments/create',
        data: $(self).serialize(),
        success: function (data) {
          // console.log(data);
          let newComment = pSelf.newCommentDom(data.data.comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          // console.log(`#post-comments-${postId}`);
          pSelf.deleteComment($('.delete-comment-button', newComment));

          //* enable the functionality of the toggle like button on the new comment
          new ToggleLike($(' .toggle-like-button', newComment));

          new Noty({
            theme: 'relax',
            text: 'Comment published!',
            type: 'success',
            layout: 'topRight',
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }

  newCommentDom(comment) {
    // console.log('newCommentDom');
    // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
    return $(`<li id="comment-${comment._id}" class="comment-list-container">
                        <p>
                        <div class="flex-space-between">
                        <small class="name">
                            ${comment.user.name}
                        </small>
                            <small>
                                <a href="/comments/destroy/${comment._id}" class="delete-comment-button">X</a>
                            </small>
                            </div>
                        
                            <small class="content">
                              ${comment.content}
                            </small>
                            <br>
                            <small>
                            <div class="like">
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                    0 Likes
                                </a>
                            </div>
                            </small>
                        </p>    
                </li>`);
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      // console.log($(deleteLink).prop('href'));

      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          // console.log(data.data);
          $(`#comment-${data.data.comment_id}`).remove();

          new Noty({
            theme: 'relax',
            text: 'Comment Deleted',
            type: 'success',
            layout: 'topRight',
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}
