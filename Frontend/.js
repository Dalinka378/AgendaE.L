const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (username === '' || email === '' || password === '' || confirmPassword === '') {
    alert('Te rog completează toate câmpurile!');
  } else if (password.length < 8) {
    alert('Parola trebuie să conțină minim 8 caractere!');
  } else if (!/\d{2,}/.test(password)) {
    alert('Parola trebuie să conțină minim 2 cifre!');
  } else if (password !== confirmPassword) {
    alert('Parolele nu coincid!');
  } else {
    // Codul pentru înregistrare aici
    console.log('Înregistrare cu succes!');
  }
});
