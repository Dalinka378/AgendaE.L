function applyTheme(mode) {
    if (mode === 'light') { // Această ramură e pentru modul "light"
        body.classList.add('light-mode');
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☼';
        }
    } else { // Această ramură ar trebui să fie pentru modul "dark"
        body.classList.remove('light-mode'); // Aici ar trebui să se adauge 'dark-mode', nu doar să se elimine 'light-mode'
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☼'; // Aici ar trebui să fie iconul de lună '☾' pentru dark mode
        }
    }
}

const toggleButton = document.getElementById("theme-toggle");
const body = document.body;
const themeToggleButton = document.getElementById('theme-toggle');

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

// Aplica tema la încărcare
const savedMode = localStorage.getItem("mode");
if (savedMode) {
    applyTheme(savedMode);
} else {
    // Tema implicită dacă nu există una salvată
    applyTheme('light');
}

// Adaugă event listener pentru butonul de toggle
if (toggleButton) {
    toggleButton.addEventListener("click", () => {
        // Determinăm noul mod bazat pe modul curent al body-ului
        const newMode = body.classList.contains("dark-mode") ? 'light' : 'dark';
        applyTheme(newMode); // Aplică noul mod
        localStorage.setItem("mode", newMode); // Salvează noul mod
    });
}