const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  if (!username || !email || !password || !confirmPassword) {
    alert('Te rog completează toate câmpurile!');
    return;
  }
  if (password.length < 8) {
    alert('Parola trebuie să conțină minim 8 caractere!');
    return;
  }
  if (!/\d{2,}/.test(password)) {
    alert('Parola trebuie să conțină minim 2 cifre!');
    return;
  }
  if (password !== confirmPassword) {
    alert('Parolele nu coincid!');
    return;
  }

  // Salvare utilizator
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Verifică dacă email-ul există deja
  if (users.some(u => u.email === email)) {
    alert('Există deja un utilizator cu acest email!');
    return;
  }

  users.push({
    username,
    email,
    password
  });

  localStorage.setItem('users', JSON.stringify(users));

  // Afișează mesaj de succes și după 2 secunde redirecționează
  alert('Înregistrare reușită! Vei fi redirecționat către pagina cu evenimente.');

  setTimeout(() => {
    window.location.href = 'evenimente.html';
  }, 2000); // 2000 milisecunde = 2 secunde
});
