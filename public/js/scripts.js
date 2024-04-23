document.getElementById('current-year').textContent = new Date().getFullYear();

//评论
document.getElementById('comment-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 防止表单提交后页面刷新
    var commentBox = document.getElementById('comment-box');
    var commentsContainer = document.getElementById('comments-container');
    var newComment = document.createElement('p');
    newComment.textContent = commentBox.value;
    commentsContainer.appendChild(newComment);
    saveComment(commentBox.value); // 保存评论到localStorage
    commentBox.value = ''; // 清空评论框
});

function saveComment(comment) {
    // 获取目前存储的评论
    var comments = localStorage.getItem('comments') ? JSON.parse(localStorage.getItem('comments')) : [];
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
    // 从localStorage加载评论
    var comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.forEach(function(comment) {
        var newComment = document.createElement('p');
        newComment.textContent = comment;
        document.getElementById('comments-container').appendChild(newComment);
    });
}

document.getElementById('clear-comments').addEventListener('click', function() {
    localStorage.removeItem('comments'); // 从localStorage中删除评论数据
    document.getElementById('comments-container').innerHTML = ''; // 清空页面上的评论显示
});


// 在页面加载时调用
window.onload = loadComments;
