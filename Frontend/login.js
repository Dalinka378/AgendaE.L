const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailOrPhone = document.getElementById('email-phone').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!emailOrPhone || !password) {
    alert('Te rog completează toate câmpurile!');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Căutăm utilizatorul după email sau telefon
  const user = users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);

  if (!user) {
    alert('Utilizatorul nu există!');
    return;
  }

  if (user.password !== password) {
    alert('Parola este greșită!');
    return;
  }

  // Dacă totul e OK:
  localStorage.setItem('loggedInUser', JSON.stringify(user));
  alert('Autentificare reușită!');

  // Redirecționare
  window.location.href = 'evenimente.html';
});
