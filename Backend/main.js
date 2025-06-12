document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded a fost declanșat. Scriptul main.js a început execuția.');

    // Logica pentru butonul de "Înapoi"
    const backBtn = document.getElementById('btn-inapoi');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            console.log('Butonul "Inapoi" a fost apăsat.');
            window.history.back();
        });
    }

    // Logica pentru încărcarea fișierelor (dacă elementele există pe pagină)
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const uploadStatus = document.getElementById('uploadStatus');

    if (uploadForm) {
        console.log('Formularul de upload (uploadForm) a fost găsit.');
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formularul de upload a fost trimis.');

            const file = fileInput.files[0];
            if (!file) {
                uploadStatus.textContent = 'Te rugăm să selectezi un fișier.';
                console.log('Eroare upload: Niciun fișier selectat.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            console.log('Fișier selectat:', file.name);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    uploadStatus.textContent = 'Fișierul a fost încărcat cu succes!';
                    fileInput.value = '';
                    console.log('Upload reușit!');
                } else {
                    const errorData = await response.json();
                    uploadStatus.textContent = `Eroare la încărcare: ${errorData.message || response.statusText}`;
                    console.error('Eroare la upload:', errorData.message || response.statusText);
                }
            } catch (error) {
                uploadStatus.textContent = 'A apărut o eroare la încărcare.';
                console.error('Eroare la upload (rețea/server):', error);
            }
        });
    } else {
        console.log('Formularul de upload (uploadForm) NU a fost găsit pe această pagină.');
    }


    // Logica pentru comutatorul de temă (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggleBtn) {
        console.log('Butonul de temă (theme-toggle) a fost găsit.');
    } else {
        console.warn('AVERTISMENT: Butonul de temă (theme-toggle) NU a fost găsit în HTML. Funcționalitatea nu va merge.');
    }

    function applyTheme(theme) {
        console.log(`Aplică tema: ${theme}`);
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<span class="icon">🌙</span> <span class="text">Mod Luminos</span>';
            }
            console.log('Clasa dark-mode adăugată. Clasa curentă a body-ului:', body.classList);
        } else {
            body.classList.remove('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<span class="icon">☀️</span> <span class="text">Mod Întunecat</span>';
            }
            console.log('Clasa dark-mode eliminată. Clasa curentă a body-ului:', body.classList);
        }
        localStorage.setItem('theme', theme);
        console.log('Tema salvată în localStorage:', localStorage.getItem('theme'));
    }

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    console.log('Tema salvată la încărcare (sau detectată din sistem):', savedTheme);
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            console.log('Butonul de temă a fost apăsat.');
            const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            console.log(`Tema curentă: ${currentTheme}, Tema nouă: ${newTheme}`);
            applyTheme(newTheme);
        });
    }

    // Logica pentru actualizarea UI-ului de autentificare
    const welcomeMsg = document.getElementById('welcome-msg');
    const registerLinkMain = document.getElementById('register-link-main');
    const loginLinkMain = document.getElementById('login-link-main');

    const navRegisterLink = document.getElementById('nav-register-link');
    const navLoginLink = document.getElementById('nav-login-link');
    const navAddEventLink = document.getElementById('nav-add-event-link');
    const navLogoutBtnContainer = document.getElementById('nav-logout-btn-container');
    const navLogoutBtn = document.getElementById('nav-logout-btn');

    function updateAuthUI() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        console.log('Actualizare UI autentificare. Utilizator logat:', loggedInUser ? loggedInUser.username : 'Niciunul');

        if (loggedInUser) {
            if (navRegisterLink) navRegisterLink.style.display = 'none';
            if (navLoginLink) navLoginLink.style.display = 'none';
            if (navAddEventLink) navAddEventLink.style.display = 'block';
            if (navLogoutBtnContainer) navLogoutBtnContainer.style.display = 'block';

            if (welcomeMsg) {
                welcomeMsg.textContent = `Bine ai venit, ${loggedInUser.username}!`;
            }
            if (registerLinkMain) registerLinkMain.style.display = 'none';
            if (loginLinkMain) loginLinkMain.style.display = 'none';

        } else {
            if (navRegisterLink) navRegisterLink.style.display = 'block';
            if (navLoginLink) navLoginLink.style.display = 'block';
            if (navAddEventLink) navAddEventLink.style.display = 'none';
            if (navLogoutBtnContainer) navLogoutBtnContainer.style.display = 'none';

            if (welcomeMsg) {
                welcomeMsg.textContent = 'Te rugăm să te înregistrezi sau să te autentifici pentru a accesa toate funcționalitățile.';
            }
            if (registerLinkMain) registerLinkMain.style.display = 'inline-block';
            if (loginLinkMain) loginLinkMain.style.display = 'inline-block';
        }
    }

    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', () => {
            console.log('Butonul de deconectare a fost apăsat.');
            localStorage.removeItem('loggedInUser');
            updateAuthUI();
            alert('Ați fost deconectat!');
            window.location.href = 'index.html';
        });
    }

    updateAuthUI();

    // Logica pentru protejarea paginilor (profile.html, adauga-eveniment.html)
    const protectedPages = ['profile.html', 'adauga-eveniment.html'];
    const currentPage = window.location.pathname.split('/').pop();
    const loggedInUserOnLoad = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log('Verificare pagini protejate. Pagina curentă:', currentPage, 'Utilizator logat la încărcare:', loggedInUserOnLoad ? 'DA' : 'NU');

    if (protectedPages.includes(currentPage) && !loggedInUserOnLoad) {
        console.log(`Redirecționare: Pagina "${currentPage}" este protejată și utilizatorul nu este logat. Redirecționare la login.html.`);
        window.location.href = 'login.html';
    }

    // Logica pentru sliderul de imagini
    const sliderImages = document.getElementById('slider-images');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    if (sliderImages && prevBtn && nextBtn) {
        console.log('Elementele sliderului au fost găsite.');
        let currentIndex = 0;
        const images = sliderImages.children;
        const totalImages = images.length;
        console.log('Număr de imagini în slider:', totalImages);

        function showImage(index) {
            if (index >= totalImages) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = totalImages - 1;
            } else {
                currentIndex = index;
            }
            console.log('Afișează imaginea cu index:', currentIndex);

            const offset = -currentIndex * 100;
            sliderImages.style.transform = `translateX(${offset}%)`;
        }

        prevBtn.addEventListener('click', () => {
            console.log('Butonul PREV slider a fost apăsat.');
            showImage(currentIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
            console.log('Butonul NEXT slider a fost apăsat.');
            showImage(currentIndex + 1);
        });
    } else {
        console.log('Elementele sliderului NU au fost găsite pe această pagină.');
    }
});