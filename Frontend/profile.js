const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) {
 window.location.href = 'login.html';
} else {
  document.getElementById('profile-username').textContent = user.username;
  document.getElementById('profile-email').textContent = user.email;
}

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
});
