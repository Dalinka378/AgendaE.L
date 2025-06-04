// profile.js - Logica pentru pagina de profil (informații, poză, evenimente, upload documente)

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Redirecționează dacă nu e logat (main.js ar trebui să facă asta, dar e bine să ai și aici)
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    // --- Informații Generale Profil ---
    const profileUsernameSpan = document.getElementById('profile-username'); // Acum va fi populat din input
    const profileEmailSpan = document.getElementById('profile-email');
    const newUsernameInput = document.getElementById('new-username-input');
    const saveUsernameBtn = document.getElementById('save-username-btn');
    const usernameStatus = document.getElementById('username-status');

    if (profileEmailSpan) {
        profileEmailSpan.textContent = loggedInUser.email;
    }
    if (newUsernameInput) {
        newUsernameInput.value = loggedInUser.username; // Populează input-ul cu numele curent
    }

    if (saveUsernameBtn) {
        saveUsernameBtn.addEventListener('click', async () => {
            const newUsername = newUsernameInput.value.trim();

            if (!newUsername) {
                usernameStatus.textContent = 'Numele de utilizator nu poate fi gol.';
                usernameStatus.style.color = 'red';
                return;
            }

            if (newUsername === loggedInUser.username) {
                usernameStatus.textContent = 'Noul nume este identic cu cel curent.';
                usernameStatus.style.color = 'orange';
                return;
            }

            // Simulează actualizarea în localStorage (și potențial, pe backend)
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === loggedInUser.email);

            if (userIndex > -1) {
                // Verifică unicitatea noului username
                const usernameExists = users.some(u => u.username === newUsername && u.email !== loggedInUser.email);
                if (usernameExists) {
                    usernameStatus.textContent = 'Acest nume de utilizator este deja folosit.';
                    usernameStatus.style.color = 'red';
                    return;
                }

                users[userIndex].username = newUsername;
                loggedInUser.username = newUsername; // Actualizează și obiectul utilizatorului logat
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                usernameStatus.textContent = 'Numele a fost actualizat cu succes!';
                usernameStatus.style.color = 'green';

                // *** AICI ai trimite cererea la backend pentru a actualiza numele ***
                // Exemplu de apel către backend (doar pentru exemplificare):
                /*
                try {
                    const response = await fetch('/api/update-username', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: loggedInUser.email, newUsername: newUsername })
                    });
                    if (response.ok) {
                        usernameStatus.textContent = 'Numele a fost actualizat cu succes!';
                        usernameStatus.style.color = 'green';
                    } else {
                        const errorData = await response.json();
                        usernameStatus.textContent = `Eroare: ${errorData.message}`;
                        usernameStatus.style.color = 'red';
                    }
                } catch (error) {
                    usernameStatus.textContent = 'A apărut o eroare de rețea.';
                    usernameStatus.style.color = 'red';
                    console.error('Eroare la actualizarea numelui:', error);
                }
                */
            }
        });
    }


    // --- Poza de Profil ---
    const profilePicPreview = document.getElementById('profile-pic-preview');
    const profilePicInput = document.getElementById('profile-pic-input');
    const uploadProfilePicBtn = document.getElementById('upload-profile-pic-btn');
    const profilePicStatus = document.getElementById('profile-pic-status');

    // Afișează poza de profil existentă la încărcarea paginii
    if (profilePicPreview && loggedInUser.profilePicUrl) {
        profilePicPreview.src = loggedInUser.profilePicUrl;
    }

    if (profilePicPreview && profilePicInput && uploadProfilePicBtn) {
        // Când se face click pe imaginea de preview, declanșează click pe input-ul de tip file ascuns
        profilePicPreview.addEventListener('click', () => {
            profilePicInput.click();
        });

        // Când se selectează un fișier, afișează preview-ul
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicPreview.src = e.target.result; // Afișează preview-ul local
                };
                reader.readAsDataURL(file);
                profilePicStatus.textContent = 'Fișier selectat. Apasă "Încarcă Poza" pentru a salva.';
                profilePicStatus.style.color = 'orange';
            } else {
                profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
                profilePicStatus.textContent = 'Niciun fișier selectat.';
                profilePicStatus.style.color = '';
            }
        });

        // Când se face click pe butonul de upload
        uploadProfilePicBtn.addEventListener('click', async () => {
            const file = profilePicInput.files[0];
            if (!file) {
                profilePicStatus.textContent = 'Te rog selectează o poză înainte de a încărca.';
                profilePicStatus.style.color = 'red';
                return;
            }

            profilePicStatus.textContent = 'Încărcare poză...';
            profilePicStatus.style.color = '#007bff';

            // *** AICI ai trimite poza la backend ***
            // Exemplu de trimitere la backend (doar pentru exemplificare):
            const formData = new FormData();
            formData.append('profilePic', file);

            try {
                // Simulează o întârziere de 1.5 secunde pentru a arăta "încărcare..."
                await new Promise(resolve => setTimeout(resolve, 1500));

                // În loc de un apel fetch real, simulăm răspunsul backend-ului
                // În realitate, backend-ul ar salva poza și ar returna un URL public
                const simulatedProfilePicUrl = URL.createObjectURL(file); // Folosim URL-ul local pentru simulare

                // Actualizează localStorage
                loggedInUser.profilePicUrl = simulatedProfilePicUrl;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.email === loggedInUser.email);
                if (userIndex > -1) {
                    users[userIndex].profilePicUrl = simulatedProfilePicUrl;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                profilePicPreview.src = simulatedProfilePicUrl; // Actualizează imaginea de pe pagină
                profilePicStatus.textContent = 'Poza de profil a fost actualizată!';
                profilePicStatus.style.color = 'green';
                profilePicInput.value = ''; // Resetează input-ul de fișier

            } catch (error) {
                profilePicStatus.textContent = 'Eroare la încărcarea pozei. Te rog încearcă din nou.';
                profilePicStatus.style.color = 'red';
                console.error('Eroare la upload poza de profil:', error);
            }
        });
    }

    // --- Evenimentele Mele Adăugate ---
    const myEventsList = document.getElementById('my-events-list');
    const noEventsMsg = document.getElementById('no-events-msg');

    if (myEventsList && noEventsMsg) {
        const allEvents = JSON.parse(localStorage.getItem('events')) || [];
        // Filtrează evenimentele adăugate de utilizatorul curent
        // Presupunem că fiecare eveniment are o proprietate 'creatorEmail' sau 'creatorUsername'
        const userEvents = allEvents.filter(event => event.creatorEmail === loggedInUser.email);
        // Sau: event.creatorUsername === loggedInUser.username; depinde cum salvezi

        if (userEvents.length > 0) {
            noEventsMsg.style.display = 'none'; // Ascunde mesajul dacă există evenimente
            myEventsList.innerHTML = ''; // Curăță lista înainte de a adăuga
            userEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card');
                eventCard.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>Data:</strong> ${event.date}</p>
                    <p><strong>Locație:</strong> ${event.location}</p>
                    <p>${event.description.substring(0, 100)}...</p>
                    <button class="view-event-btn" data-event-id="${event.id}">Vezi Detalii</button>
                    `;
                myEventsList.appendChild(eventCard);
            });
        } else {
            noEventsMsg.style.display = 'block'; // Afișează mesajul dacă nu sunt evenimente
        }
    }


    // --- Logica pentru Încărcare Documente Generale (mutată din main.js) ---
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const customUploadButton = document.getElementById('customUploadButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadStatus = document.getElementById('uploadStatus');

    if (uploadForm && fileInput && customUploadButton && fileNameDisplay && uploadStatus) {
        // Când se face click pe butonul personalizat, declanșează click pe input-ul de tip file ascuns
        customUploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        // Când se selectează un fișier, afișează numele fișierului
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
                uploadStatus.textContent = ''; // Curăță statusul anterior
            } else {
                fileNameDisplay.textContent = 'Niciun fișier selectat';
            }
        });

        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const file = fileInput.files[0];
            if (!file) {
                uploadStatus.textContent = 'Te rugăm să selectezi un fișier.';
                return;
            }

            // Reset status message
            uploadStatus.textContent = 'Încărcare document...';
            uploadStatus.style.color = '#007bff';

            const formData = new FormData();
            formData.append('file', file);

            try {
                // *** AICI trimite fișierul către backend-ul partenerului tău ***
                const response = await fetch('/api/upload-document', { // Exemplu: /api/upload-document
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json(); // Dacă backend-ul returnează un JSON
                    uploadStatus.textContent = `Fișierul "${result.fileName || file.name}" a fost încărcat cu succes!`;
                    uploadStatus.style.color = '#28a745'; // Culoare pentru succes
                    fileInput.value = ''; // Curăță input-ul de fișier
                    fileNameDisplay.textContent = 'Niciun fișier selectat';
                } else {
                    const errorData = await response.json().catch(() => ({ message: 'Eroare necunoscută' }));
                    uploadStatus.textContent = `Eroare la încărcare: ${errorData.message || response.statusText}`;
                    uploadStatus.style.color = '#dc3545';
                }
            } catch (error) {
                uploadStatus.textContent = 'A apărut o eroare la încărcare. Verifică consola pentru detalii.';
                uploadStatus.style.color = '#dc3545';
                console.error('Eroare la trimiterea documentului:', error);
            }
        });
    }
});