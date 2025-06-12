// login.js - Logica specifică pentru pagina de autentificare

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form'); // Acesta caută formularul cu ID-ul 'login-form'

    if (loginForm) { // Asigură-te că formularul există pe pagină înainte de a adăuga event listener
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Oprește reîncărcarea paginii

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
            localStorage.setItem('loggedInUser', JSON.stringify(user)); // Salvează utilizatorul logat
            alert('Autentificare reușită!');

            window.location.href = 'index.html';
        });
    }
});
