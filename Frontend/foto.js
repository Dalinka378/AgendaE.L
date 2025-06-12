// =======================================================
// Logica pentru comutarea temei (Dark Mode / Light Mode)
// =======================================================

// Obținem referințe la elementele DOM necesare pentru tema
const themeToggleButton = document.getElementById("theme-toggle");
const body = document.body;

/**
 * Aplică tema (dark sau light) la elementul body și actualizează iconul butonului.
 * @param {string} mode - Modul temei ('dark' sau 'light').
 */
function applyTheme(mode) {
    if (mode === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode'); // Asigură-te că light-mode este eliminat
        if (themeToggleButton) {
            // Actualizează iconul butonului la 'lună' pentru dark mode
            const iconSpan = themeToggleButton.querySelector('.icon');
            if (iconSpan) {
                iconSpan.textContent = '☾';
            }
        }
    } else { // Orice altceva înseamnă 'light'
        body.classList.add('light-mode');
        body.classList.remove('dark-mode'); // Asigură-te că dark-mode este eliminat
        if (themeToggleButton) {
            // Actualizează iconul butonului la 'soare' pentru light mode
            const iconSpan = themeToggleButton.querySelector('.icon');
            if (iconSpan) {
                iconSpan.textContent = '☼';
            }
        }
    }
}

// La încărcarea paginii, verificăm tema salvată în localStorage
const savedMode = localStorage.getItem("mode");
if (savedMode) {
    applyTheme(savedMode);
} else {
    // Dacă nu există o temă salvată, aplicăm tema implicită (light)
    applyTheme('light');
}

// Adăugăm un event listener pentru butonul de comutare a temei
if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
        // Determinăm noul mod bazat pe prezența clasei 'dark-mode' pe body
        const newMode = body.classList.contains("dark-mode") ? 'light' : 'dark';
        applyTheme(newMode); // Aplică noul mod
        localStorage.setItem("mode", newMode); // Salvează noul mod în localStorage
    });
}


// =======================================================
// Logica pentru încărcarea și previzualizarea imaginilor
// =======================================================

// Obținem referințe la elementele DOM necesare pentru încărcarea imaginilor
// Notă: Aceste elemente trebuie să existe în HTML-ul paginii unde este inclus acest script.
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const dropArea = document.getElementById('drop-area');
const previewContainer = document.getElementById('preview-container');
const loadingOverlay = document.getElementById('loading-overlay'); // Elementul pentru spinner-ul de încărcare
const messageBox = document.getElementById('message-box'); // Elementul pentru caseta de mesaje

// Un array pentru a stoca fișierele de imagine selectate
let selectedFiles = [];

/**
 * Afișează un mesaj temporar într-o casetă de mesaje personalizată.
 * @param {string} message - Textul mesajului de afișat.
 * @param {number} [duration=3000] - Durata în milisecunde pentru care mesajul va fi vizibil.
 */
function showMessage(message, duration = 3000) {
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, duration);
    } else {
        console.warn("Elementul #message-box nu a fost găsit în DOM.");
        // Fallback la console.log dacă elementul nu există
        console.log("Mesaj:", message);
    }
}

/**
 * Afișează sau ascunde overlay-ul cu spinner-ul de încărcare.
 * @param {boolean} show - True pentru a afișa, false pentru a ascunde.
 */
function showLoading(show) {
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.add('visible');
        } else {
            loadingOverlay.classList.remove('visible');
        }
    } else {
        console.warn("Elementul #loading-overlay nu a fost găsit în DOM.");
    }
}

/**
 * Creează și adaugă o previzualizare pentru un fișier imagine.
 * @param {File} file - Obiectul File pentru imaginea de previzualizat.
 */
function createPreview(file) {
    // Verificăm dacă fișierul este o imagine
    if (!file.type.startsWith('image/')) {
        showMessage('Fișierul "' + file.name + '" nu este o imagine și a fost ignorat.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const imgContainer = document.createElement('div');
        // Clase Tailwind CSS pentru stilizare (responsive, umbre, colțuri rotunjite)
        imgContainer.className = 'relative group rounded-lg overflow-hidden shadow-md';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Previzualizare imagine';
        // Clase Tailwind CSS pentru dimensiuni, obiect-fit și colțuri rotunjite
        img.className = 'w-full h-32 object-cover rounded-lg';

        const removeButton = document.createElement('button');
        // SVG pentru iconul de ștergere
        removeButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A8 8 0 111 12a8 8 0 0115 0z" />
            </svg>
        `;
        // Clase Tailwind CSS pentru stilizarea butonului de eliminare
        removeButton.className = 'absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-red-500';
        removeButton.title = 'Elimină imaginea';

        // Logică pentru eliminarea imaginii
        removeButton.onclick = () => {
            // Eliminăm fișierul din array-ul selectedFiles
            selectedFiles = selectedFiles.filter(f => f !== file);
            // Eliminăm elementul previzualizării din DOM
            imgContainer.remove();
            showMessage('Imaginea a fost eliminată.');
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeButton);
        if (previewContainer) {
            previewContainer.appendChild(imgContainer);
        } else {
            console.warn("Elementul #preview-container nu a fost găsit în DOM.");
        }
    };
    reader.readAsDataURL(file); // Citim fișierul ca URL de date
}

/**
 * Gestionează fișierele selectate (fie prin input, fie prin drag-and-drop).
 * Afișează un spinner de încărcare și creează previzualizări.
 * @param {FileList} files - Un obiect FileList care conține fișierele selectate.
 */
function handleFiles(files) {
    showLoading(true); // Afișează spinner-ul de încărcare
    setTimeout(() => { // Simulăm o mică întârziere pentru vizualizarea spinner-ului
        for (const file of files) {
            selectedFiles.push(file); // Adăugăm fișierul în array-ul nostru
            createPreview(file); // Creăm previzualizarea
        }
        showMessage(`Au fost adăugate ${files.length} imagini.`);
        showLoading(false); // Ascunde spinner-ul
    }, 500); // Scurtă întârziere pentru efect vizual
}

// Adăugăm event listener pentru butonul de încărcare
if (uploadButton) {
    uploadButton.addEventListener('click', () => {
        if (fileInput) {
            fileInput.click(); // Declansează click-ul pe input-ul de tip fișier ascuns
        }
    });
}

// Adăugăm event listener pentru schimbarea input-ului de tip fișier (când fișierele sunt selectate)
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });
}

// Gestionare drag-and-drop
if (dropArea) {
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault(); // Previne comportamentul implicit (deschiderea fișierului în browser)
        dropArea.classList.add('border-indigo-500', 'bg-indigo-50'); // Adaugă stil de evidențiere
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('border-indigo-500', 'bg-indigo-50'); // Elimină stilul de evidențiere
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault(); // Previne comportamentul implicit
        dropArea.classList.remove('border-indigo-500', 'bg-indigo-50'); // Elimină stilul de evidențiere
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
}

// =======================================================
// Funcția pentru a trimite imaginile către backend (exemplu)
// =======================================================

/**
 * Funcție exemplu pentru a trimite imaginile selectate către un endpoint de backend.
 * Aceasta trebuie apelată la momentul potrivit (ex: când utilizatorul apasă "Trimite Anunțul").
 */
async function uploadImagesToServer() {
    if (selectedFiles.length === 0) {
        showMessage('Nu ai selectat nicio imagine pentru a încărca.');
        return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
        // Asigură-te că numele câmpului ('image0', 'image1' etc.) se potrivește cu ce așteaptă backend-ul tău.
        // Backend-ul Flask așteaptă de obicei un singur câmp cu numele 'image0' dacă e upload.array('image0')
        // Dacă backend-ul așteaptă mai multe, poți folosi 'images[]'
        formData.append(`image${index}`, file);
    });

    showLoading(true); // Afișează spinner-ul înainte de trimitere
    try {
        // Adresa URL a endpoint-ului tău de backend pentru upload-ul imaginilor
        // Înlocuiește 'http://localhost:3000/api/upload-foto' cu adresa reală a backend-ului tău!
        const response = await fetch('http://localhost:3000/api/upload-foto', {
            method: 'POST',
            body: formData,
            // Nu seta Content-Type pentru FormData; browserul o va face automat cu "multipart/form-data"
        });

        const data = await response.json(); // Așteaptă răspunsul JSON de la backend

        if (response.ok) { // Verifică dacă răspunsul HTTP este în intervalul 2xx (succes)
            showMessage('Imaginile au fost încărcate cu succes!', 5000);
            console.log('Răspuns de la server:', data);
            // După succes, poți reseta câmpurile dacă dorești
            selectedFiles = [];
            if (previewContainer) {
                previewContainer.innerHTML = '';
            }
        } else {
            // Dacă răspunsul nu este OK, afișează un mesaj de eroare
            const errorMessage = data.message || 'Eroare necunoscută la încărcarea imaginilor.';
            showMessage(`Eroare la încărcarea imaginilor: ${errorMessage}`, 5000);
            console.error('Eroare la încărcarea imaginilor:', data);
        }
    } catch (error) {
        // Prinde erorile de rețea sau alte erori la nivel de fetch
        showMessage('A apărut o problemă de rețea sau de server la încărcarea imaginilor.', 5000);
        console.error('Eroare Fetch:', error);
    } finally {
        showLoading(false); // Ascunde spinner-ul indiferent de rezultat
    }
}

// Exemplu: Poți apela 'uploadImagesToServer()' printr-un alt buton, de exemplu, un buton "Trimite Anunțul"
// const submitAnnouncementButton = document.getElementById('submit-announcement-button');
// if (submitAnnouncementButton) {
//     submitAnnouncementButton.addEventListener('click', uploadImagesToServer);
// }
