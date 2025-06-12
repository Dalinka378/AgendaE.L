
const toggleButton = document.getElementById("theme-toggle"); 
const body = document.body;
const themeToggleButton = document.getElementById('theme-toggle');


function applyTheme(mode) {
    if (mode === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☾';
        }
    } else {
        body.classList.remove('light-mode');
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☼';
        }
    }
}
function applyTheme(mode) {
    if (mode === 'light') {
        body.classList.add('light-mode');
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☼';
        }
    } else {
        body.classList.remove('light-mode');
        if (themeToggleButton) {
            themeToggleButton.querySelector('.icon').textContent = '☼';
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