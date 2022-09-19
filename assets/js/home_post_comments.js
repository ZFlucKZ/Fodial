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
    return $(`<li id="comment-${comment._id}">
                        <p>
                            <small>
                                <a href="/comments/destroy/${comment._id}" class="delete-comment-button">X</a>
                            </small>
                            
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
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
