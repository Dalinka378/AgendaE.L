const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) {
  window.location.href = 'login.html';
}

const eventsUl = document.getElementById('events-ul');
const eventForm = document.getElementById('event-form');

function afiseazaEvenimente() {
  const events = JSON.parse(localStorage.getItem('events')) || [];

  eventsUl.innerHTML = '';

  if (events.length === 0) {
    eventsUl.innerHTML = '<li>Nu există evenimente momentan.</li>';
    return;
  }

  events.forEach(event => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${event.title}</strong> - ${event.date} <br/>
                    <em>Creat de: ${event.createdBy}</em><br/>
                    <p>${event.description}</p>`;
    eventsUl.appendChild(li);
  });
}

afiseazaEvenimente();

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value.trim();

  if (!title || !date || !description) {
    alert('Completează toate câmpurile!');
    return;
  }

  const events = JSON.parse(localStorage.getItem('events')) || [];

  events.push({
    title,
    date,
    description,
    createdBy: user.username,
  });

  localStorage.setItem('events', JSON.stringify(events));

  alert('Eveniment adăugat cu succes!');

  eventForm.reset();

  afiseazaEvenimente();
});
document.addEventListener('DOMContentLoaded', () => {
    const sliderImages = document.querySelector('.slider-images');
    const images = document.querySelectorAll('.slider-images img');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    let currentIndex = 0; 
    const totalImages = images.length; 
    function updateSlider() {
        sliderImages.style.transform = `translateX(${-currentIndex * 100}%)`;
    }
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= totalImages) {
            currentIndex = 0; 
        }
        updateSlider();
    });
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalImages - 1; 
        }
        updateSlider();
    });
    updateSlider();
});
document.addEventListener('DOMContentLoaded', () => {
    // ... alte variabile ...
    const navLogoutBtn = document.getElementById('nav-logout-btn');
    // ...

    // Logica pentru butonul de deconectare
    if (navLogoutBtn) { // Această verificare este crucială
        navLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser'); // Elimină utilizatorul din localStorage
            alert('Ai fost deconectat!');
            // Redirecționează către pagina principală sau de login
            window.location.href = 'index.html'; // Sau 'login.html'
            updateNavVisibility(); // Actualizează navigarea imediat
        });
    }
});
// evenimente.js

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const eventsUl = document.getElementById('events-ul');
    const eventForm = document.getElementById('event-form');

    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const previewContainer = document.getElementById('preview-container');
    const messageBox = document.getElementById('message-box');
    const loadingOverlay = document.getElementById('loading-overlay');

    let selectedFiles = [];

    function showMessage(message, type = 'info') {
        if (!messageBox) return;
        messageBox.textContent = message;
        messageBox.className = 'message-box';
        if (type === 'error') {
            messageBox.classList.add('error');
        } else if (type === 'success') {
            messageBox.classList.add('success');
        }
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }

    function displayPreviews() {
        if (!previewContainer) return;
        previewContainer.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgWrapper = document.createElement('div');
                imgWrapper.classList.add('preview-item');
                imgWrapper.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" class="preview-image">
                    <button class="remove-image-btn" data-index="${index}">X</button>
                `;
                previewContainer.appendChild(imgWrapper);
            };
            reader.readAsDataURL(file);
        });

        previewContainer.querySelectorAll('.remove-image-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                selectedFiles.splice(indexToRemove, 1);
                displayPreviews();
                showMessage('Imagine eliminată din previzualizare.', 'info');
            });
        });
    }

    function handleFiles(files) {
        if (!files || files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) {
                showMessage(`Fișierul "${file.name}" nu este o imagine și a fost ignorat.`, 'error');
                continue;
            }
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                showMessage(`Imaginea "${file.name}" este prea mare (max ${MAX_FILE_SIZE / (1024 * 1024)}MB).`, 'error');
                continue;
            }
            selectedFiles.push(file);
        }
        displayPreviews();
        showMessage(`S-au adăugat ${files.length} imagini pentru previzualizare.`, 'success');
    }

    function afiseazaEvenimente() {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        if (!eventsUl) return;

        eventsUl.innerHTML = '';

        if (events.length === 0) {
            eventsUl.innerHTML = '<p>Nu există evenimente momentan.</p>';
            return;
        }

        events.sort((a, b) => new Date(b.date) - new Date(a.date));

        events.forEach(event => {
            const li = document.createElement('li');
            li.classList.add('event-item');

            let imageHtml = '';
            if (event.images && event.images.length > 0) {
                imageHtml = `<img src="${event.images[0]}" alt="Imagine eveniment" class="event-thumbnail">`;
            } else {
                imageHtml = `<img src="images/placeholder-event.png" alt="Fără imagine" class="event-thumbnail">`;
            }

            li.innerHTML = `
                ${imageHtml}
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p><strong>Data:</strong> ${event.date}</p>
                    <p><strong>Creat de:</strong> ${event.createdBy}</p>
                    <p>${event.description}</p>
                </div>
            `;
            eventsUl.appendChild(li);
        });
    }

    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('title').value.trim();
            const date = document.getElementById('date').value;
            const description = document.getElementById('description').value.trim();

            if (!title || !date || !description) {
                showMessage('Completează toate câmpurile obligatorii!', 'error');
                return;
            }

            if (selectedFiles.length === 0) {
                showMessage('Te rog adaugă cel puțin o imagine pentru eveniment!', 'error');
                return;
            }

            if (loadingOverlay) loadingOverlay.style.display = 'flex';

            const imageUrls = [];
            for (const file of selectedFiles) {
                try {
                    const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target.result);
                        reader.onerror = (error) => reject(error);
                        reader.readAsDataURL(file);
                    });
                    imageUrls.push(dataUrl);
                } catch (error) {
                    console.error('Eroare la citirea fișierului imagine:', error);
                    showMessage(`Eroare la procesarea imaginii: ${file.name}`, 'error');
                    if (loadingOverlay) loadingOverlay.style.display = 'none';
                    return;
                }
            }

            const events = JSON.parse(localStorage.getItem('events')) || [];

            events.push({
                id: 'evt_' + Date.now(),
                title,
                date,
                description,
                createdBy: user.username,
                images: imageUrls,
            });

            localStorage.setItem('events', JSON.stringify(events));

            showMessage('Eveniment adăugat cu succes!', 'success');

            eventForm.reset();
            selectedFiles = [];
            if (previewContainer) previewContainer.innerHTML = '';

            if (loadingOverlay) loadingOverlay.style.display = 'none';
            afiseazaEvenimente();
        });
    }

    if (dropArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
        });

        dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }, false);
    }

    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            if (fileInput) fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
            e.target.value = '';
        });
    }

    afiseazaEvenimente();

    const sliderImages = document.querySelector('.slider-images');
    const images = document.querySelectorAll('.slider-images img');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    let currentIndex = 0;
    const totalImages = images.length;

    function updateSlider() {
        if (sliderImages) {
            sliderImages.style.transform = `translateX(${-currentIndex * 100}%)`;
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            if (currentIndex >= totalImages) {
                currentIndex = 0;
            }
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = totalImages - 1;
            }
            updateSlider();
        });
    }
    updateSlider();

    const navLogoutBtn = document.getElementById('logoutBtn'); // Changed to logoutBtn based on HTML provided
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            alert('Ai fost deconectat!');
            window.location.href = 'index.html';
        });
    }

    const themeToggleSun = document.getElementById('theme-toggle-light');
    const themeToggleMoon = document.getElementById('theme-toggle-dark');

    if (themeToggleSun && themeToggleMoon) {
        const setTheme = (theme) => {
            document.body.classList.toggle('dark-mode', theme === 'dark');
            localStorage.setItem('theme', theme);
        };

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('light');
        }

        themeToggleSun.addEventListener('click', () => setTheme('light'));
        themeToggleMoon.addEventListener('click', () => setTheme('dark'));
    }
});
// ... (restul codului) ...

function afiseazaEvenimente() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    if (!eventsUl) return;

    eventsUl.innerHTML = '';

    if (events.length === 0) {
        eventsUl.innerHTML = '<p>Nu există evenimente momentan.</p>';
        return;
    }

    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    events.forEach(event => {
        const li = document.createElement('li');
        li.classList.add('event-item');

        let imageHtml = '';
        // ACEASTĂ SECȚIUNE ESTE CEA CARE ADAUGĂ IMAGINEA
        if (event.images && event.images.length > 0) {
            imageHtml = `<img src="${event.images[0]}" alt="Imagine eveniment" class="event-thumbnail">`;
        } else {
            imageHtml = `<img src="images/placeholder-event.png" alt="Fără imagine" class="event-thumbnail">`;
        }

        li.innerHTML = `
            ${imageHtml}  <-- Aici este inserată imaginea
            <div class="event-details">
                <h3>${event.title}</h3>
                <p><strong>Data:</strong> ${event.date}</p>
                <p><strong>Creat de:</strong> ${event.createdBy}</p>
                <p>${event.description}</p>
            </div>
        `;
        eventsUl.appendChild(li);
    });
}
