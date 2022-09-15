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
    return $(`<li id="post-${post._id}">
              <p>
                
                  <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id} ">X</a>
                  </small>
                 
                  ${post.content}
                      <br>
                      <small>
                      ${user}
                      </small>
              </p>
              <div class="post-comments">
                
                  <form action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Comment Here...">
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Comment">
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
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  createPost();
}
