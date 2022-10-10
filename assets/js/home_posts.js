{
  //* method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $('#new-post-form');
    let postTextArea = document.getElementById('text-post');

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'post',
        url: '/posts/create',
        data: newPostForm.serialize(),
        success: function (data) {
          postTextArea.value = '';
          let newPost = newPostDom(data.data);
          $('#posts-list-container>ul').prepend(newPost);
          deletePost($('.delete-post-button', newPost));

          new PostComments(data.data.post._id);

          new ToggleLike($(' .toggle-like-button', newPost));

          new Noty({
            theme: 'relax',
            text: 'Post published!',
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
  };

  //* method to create a post in DOM
  let newPostDom = function (data) {
    let post = data.post;
    let user = data.user;
    return $(`<li id="post-${post._id}" class="post-list-container">
              <p>
                <div class="flex-space-between">
                <small class="name">
                  ${user}
                </small>
                  <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id} ">X</a>
                  </small>
                </div>
                  <small class="content">
                    ${post.content}
                  </small>
                  
                      <br>
                        <small>
                          <div class="like">
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                    0 Likes
                                </a>
                          </div>
                        </small>
              </p>
              <div class="post-comments">
                
                  <form action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Comment Here..." class="text-comment">
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Comment" class="btn">
                  </form>
              
                    <div class="posts-comments-list">
                      <ul id="post-coments-${post._id}">
                        
                      </ul>
                    </div>
              </div>

            </li>`);
  };

  //* method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();

          new Noty({
            theme: 'relax',
            text: 'Post Deleted',
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
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $('#posts-list-container>ul>li').each(function () {
      let self = $(this);
      let deleteButton = $(' .delete-post-button', self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop('id').split('-')[1];
      new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
