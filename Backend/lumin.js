
const toggleButton = document.getElementById("theme-toggle"); // IMPORTANT: Asigură-te că ID-ul este corect!
const body = document.body;
const themeToggleButton = document.getElementById('theme-toggle'); // Referință suplimentară pentru buton


function applyTheme(mode) {
    if (mode === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '🌙';
            themeToggleButton.querySelector('.text').textContent = 'Mod Luminos';
        }
    } else {
        body.classList.remove('dark-mode');
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☀️';
            themeToggleButton.querySelector('.text').textContent = 'Mod Întunecat';
        }
    }
}


const savedMode = localStorage.getItem("mode");
if (savedMode) {
    applyTheme(savedMode);
} else {
    
    applyTheme('light'); 
}


if (toggleButton) {
    toggleButton.addEventListener("click", () => {
        const newMode = body.classList.contains("dark-mode") ? 'light' : 'dark';
        applyTheme(newMode);
        localStorage.setItem("mode", newMode);
    });
}