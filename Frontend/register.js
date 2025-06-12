// register.js - Logica specifică pentru pagina de înregistrare

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form'); // Acesta caută formularul cu ID-ul 'register-form'

    if (registerForm) { // Asigură-te că formularul există pe pagină înainte de a adăuga event listener
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();

            if (!username || !email || !password || !confirmPassword) {
                alert('Completează toate câmpurile!');
                return;
            }

            if (password !== confirmPassword) {
                alert('Parolele nu se potrivesc!');
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];

            // Verifică dacă utilizatorul (email sau username) există deja
            const userExists = users.some(u => u.email === email || u.username === username);
            if (userExists) {
                alert('Acest email sau utilizator există deja!');
                return;
            }

            // Adaugă noul utilizator
            users.push({ username, email, password }); // Poți adăuga și alte câmpuri, ex: phone
            localStorage.setItem('users', JSON.stringify(users));

            alert('Înregistrare reușită! Acum te poți autentifica.');
            window.location.href = 'login.html'; // Redirecționează la pagina de login
        });
    }
});