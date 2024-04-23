//个人登录界面
document.addEventListener('DOMContentLoaded', function() {
    const profileLink = document.getElementById('profileLink');
    fetch('/api/check-login')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            profileLink.href = './user/profile.html';  // 指向个人信息页面
        } else {
            profileLink.href = './html/login.html';  // 指向登录页面
        }
    })
    .catch(error => console.error('Error checking login status:', error));
});