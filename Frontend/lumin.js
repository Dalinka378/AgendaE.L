// Obținem referințele la elementele DOM o singură dată
const body = document.body;
const themeToggleButton = document.getElementById('theme-toggle'); // Folosim același ID pentru buton

/**
 * Aplică tema (dark/light) pe elementul body și actualizează iconul butonului.
 * @param {string} mode - 'dark' sau 'light'.
 */
function applyTheme(mode) {
    if (mode === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode'); // Asigură-te că light-mode e eliminat
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☾'; // Icon pentru dark mode
        }
    } else { // Presupunem că orice altceva înseamnă 'light'
        body.classList.add('light-mode');
        body.classList.remove('dark-mode'); // Asigură-te că dark-mode e eliminat
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☼'; // Icon pentru light mode
        }
    }
}

// --- Logica pentru aplicarea temei la încărcarea paginii ---

// Verifică dacă există o temă salvată în localStorage
const savedMode = localStorage.getItem("mode");

if (savedMode) {
    // Dacă există o temă salvată, aplic-o
    applyTheme(savedMode);
} else {
    // Dacă nu există o temă salvată, verifică preferința sistemului de operare
    // (prefers-color-scheme) sau setează o temă implicită (ex: 'light')
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark'); // Aplică dark mode dacă sistemul preferă
    } else {
        applyTheme('light'); // Altfel, aplică light mode implicit
    }
}


// --- Logica pentru butonul de toggle ---

// Adaugă event listener pentru butonul de toggle, dacă butonul există
if (themeToggleButton) { // Am redenumit din toggleButton în themeToggleButton pentru consistență
    themeToggleButton.addEventListener("click", () => {
        // Determinăm noul mod bazat pe modul curent al body-ului
        const newMode = body.classList.contains("dark-mode") ? 'light' : 'dark';
        applyTheme(newMode); // Aplică noul mod
        localStorage.setItem("mode", newMode); // Salvează noul mod în localStorage
    });
}