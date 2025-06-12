// profile.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Redirecționare dacă utilizatorul nu este logat
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'login.html'; // Redirecționează către pagina de logare
        return; // Oprește execuția ulterioară a scriptului
    }

    // Referințe la elementele HTML din pagina de profil
    const profileEmailSpan = document.getElementById('profile-email');
    const newUsernameInput = document.getElementById('new-username-input');
    const saveUsernameBtn = document.getElementById('save-username-btn');
    const usernameStatus = document.getElementById('username-status');

    const profilePicPreview = document.getElementById('profile-pic-preview'); // ID-ul corect din HTML
    const profilePicInput = document.getElementById('profile-pic-input');
    const uploadProfilePicBtn = document.getElementById('upload-profile-pic-btn'); // ID-ul corect din HTML
    const profilePicStatus = document.getElementById('profile-pic-status');

    const myEventsList = document.getElementById('my-events-list');
    const noEventsMsg = document.getElementById('no-events-msg');

    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const customUploadButton = document.getElementById('customUploadButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadStatus = document.getElementById('uploadStatus');

    // 2. Afișarea informațiilor de bază ale utilizatorului
    if (profileEmailSpan) {
        profileEmailSpan.textContent = loggedInUser.email;
    }
    if (newUsernameInput) {
        // Asigură-te că valoarea default este goală dacă username-ul nu există încă
        newUsernameInput.value = loggedInUser.username || '';
        newUsernameInput.addEventListener('input', () => {
            usernameStatus.textContent = ''; // Curăță mesajul de stare la fiecare modificare
        });
    }

    // 3. Gestionarea salvării numelui de utilizator
    if (saveUsernameBtn) {
        saveUsernameBtn.addEventListener('click', async () => {
            const newUsername = newUsernameInput.value.trim();
            if (!newUsername) {
                usernameStatus.textContent = 'Numele de utilizator nu poate fi gol.';
                usernameStatus.style.color = 'red';
                return;
            }
            if (newUsername === (loggedInUser.username || '')) { // Compară și cu string gol dacă nu e setat
                usernameStatus.textContent = 'Noul nume este identic cu cel curent.';
                usernameStatus.style.color = 'orange';
                return;
            }

            saveUsernameBtn.disabled = true; // Dezactivează butonul pe durata procesului

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === loggedInUser.email);

            if (userIndex > -1) {
                // Verifică dacă noul username este deja folosit de altcineva
                const usernameExists = users.some(u => u.username === newUsername && u.email !== loggedInUser.email);
                if (usernameExists) {
                    usernameStatus.textContent = 'Acest nume de utilizator este deja folosit.';
                    usernameStatus.style.color = 'red';
                    saveUsernameBtn.disabled = false;
                    return;
                }

                users[userIndex].username = newUsername;
                loggedInUser.username = newUsername; // Actualizează și obiectul din sesiune
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser)); // Actualizează loggedInUser

                usernameStatus.textContent = 'Numele a fost actualizat cu succes!';
                usernameStatus.style.color = 'green';
            } else {
                usernameStatus.textContent = 'Eroare: Utilizatorul nu a putut fi găsit.';
                usernameStatus.style.color = 'red';
            }
            saveUsernameBtn.disabled = false; // Reactivează butonul
        });
    }

    // 4. Gestionarea pozei de profil
    // Inițializează previzualizarea cu poza existentă sau default
    if (profilePicPreview) {
        profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
    }

    // Deschide selectorul de fișiere la click pe imaginea de previzualizare
    if (profilePicPreview && profilePicInput) {
        profilePicPreview.addEventListener('click', () => {
            profilePicInput.click();
        });

        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!validImageTypes.includes(file.type)) {
                    profilePicStatus.textContent = 'Selectează o imagine validă (jpg, png, gif).';
                    profilePicStatus.style.color = 'red';
                    profilePicInput.value = ''; // Resetează inputul
                    profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
                    return;
                }
                if (file.size > 2 * 1024 * 1024) { // 2MB limită
                    profilePicStatus.textContent = 'Imaginea trebuie să fie mai mică de 2MB.';
                    profilePicStatus.style.color = 'red';
                    profilePicInput.value = '';
                    profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicPreview.src = e.target.result; // Previzualizează imaginea
                };
                reader.readAsDataURL(file);
                profilePicStatus.textContent = 'Fișier selectat. Apasă "Încarcă Poza" pentru a salva.';
                profilePicStatus.style.color = 'orange';
            } else {
                profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png'; // Revert la imaginea existentă
                profilePicStatus.textContent = 'Niciun fișier selectat.';
                profilePicStatus.style.color = '';
            }
        });
    }

    // Gestionarea încărcării pozei de profil (simulată, nu necesită backend)
    if (uploadProfilePicBtn) {
        uploadProfilePicBtn.addEventListener('click', async () => {
            const file = profilePicInput.files[0];
            if (!file) {
                profilePicStatus.textContent = 'Te rog selectează o poză înainte de a încărca.';
                profilePicStatus.style.color = 'red';
                return;
            }

            profilePicStatus.textContent = 'Încărcare poză...';
            profilePicStatus.style.color = '#007bff';
            uploadProfilePicBtn.disabled = true;

            try {
                // SIMULAREA ÎNCĂRCĂRII POZEI DE PROFIL
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulează o întârziere

                // Creează un URL temporar pentru previzualizare locală.
                // Notă: Acest URL va expira la reîncărcarea paginii.
                // Pentru persistență reală, ai nevoie de un backend care stochează imaginea și îi returnează un URL permanent.
                const simulatedProfilePicUrl = URL.createObjectURL(file);

                loggedInUser.profilePicUrl = simulatedProfilePicUrl;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.email === loggedInUser.email);
                if (userIndex > -1) {
                    users[userIndex].profilePicUrl = simulatedProfilePicUrl;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                profilePicPreview.src = simulatedProfilePicUrl; // Actualizează imaginea afișată
                profilePicStatus.textContent = 'Poza de profil a fost actualizată!';
                profilePicStatus.style.color = 'green';
                profilePicInput.value = ''; // Golește inputul
            } catch (error) {
                profilePicStatus.textContent = 'Eroare la încărcarea pozei (simulată). Te rog încearcă din nou.';
                profilePicStatus.style.color = 'red';
                console.error('Eroare la upload poza de profil (simulată):', error);
            } finally {
                uploadProfilePicBtn.disabled = false; // Reactivează butonul
            }
        });
    }


    // 5. Afișarea evenimentelor adăugate de utilizator (nu s-a schimbat)
    if (myEventsList && noEventsMsg) {
        const allEvents = JSON.parse(localStorage.getItem('events')) || [];
        const userEvents = allEvents.filter(event => event.creatorEmail === loggedInUser.email);

        if (userEvents.length > 0) {
            noEventsMsg.style.display = 'none';
            myEventsList.innerHTML = ''; // Curăță lista înainte de a adăuga
            userEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card');
                eventCard.setAttribute('data-event-id', event.id); // Utile pentru editare/vizualizare
                eventCard.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>Data:</strong> ${event.date}</p>
                    <p><strong>Locație:</strong> ${event.location}</p>
                    <p>${event.description.substring(0, 100)}...</p>
                    <button class="view-event-btn" data-event-id="${event.id}">Vezi Detalii</button>
                    <button class="edit-event-btn" data-event-id="${event.id}">Editează</button>
                    <button class="delete-event-btn" data-event-id="${event.id}">Șterge</button>
                `;
                myEventsList.appendChild(eventCard);
            });

            // Adaugă event listener pentru butoanele "Vezi Detalii" (sau edit/delete)
            myEventsList.querySelectorAll('.view-event-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventId = e.target.dataset.eventId;
                    alert(`Vei vedea detalii pentru evenimentul cu ID: ${eventId}`);
                });
            });
            myEventsList.querySelectorAll('.edit-event-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventId = e.target.dataset.eventId;
                    alert(`Editare eveniment cu ID: ${eventId}`);
                });
            });
            myEventsList.querySelectorAll('.delete-event-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventId = e.target.dataset.eventId;
                    if (confirm('Ești sigur că vrei să ștergi acest eveniment?')) {
                        let events = JSON.parse(localStorage.getItem('events')) || [];
                        events = events.filter(event => event.id !== eventId);
                        localStorage.setItem('events', JSON.stringify(events));
                        alert('Eveniment șters cu succes!');
                        location.reload();
                    }
                });
            });

        } else {
            noEventsMsg.style.display = 'block';
        }
    }

    // 6. Gestionarea încărcării documentelor (ACUM DOAR SIMULATĂ, pentru a evita erorile de backend)
    // Dacă vrei să încerci cu backend, trebuie să decomentezi secțiunea "Real Backend Upload"
    // și să te asiguri că serverul tău este pornit și ruta funcțională.
    if (uploadForm && fileInput && customUploadButton && fileNameDisplay && uploadStatus) {
        customUploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
                uploadStatus.textContent = ''; // Curăță mesajul de stare
            } else {
                fileNameDisplay.textContent = 'Niciun fișier selectat';
                uploadStatus.textContent = '';
            }
        });

        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const file = fileInput.files[0];
            if (!file) {
                uploadStatus.textContent = 'Te rugăm să selectezi un fișier.';
                uploadStatus.style.color = 'red';
                return;
            }

            uploadStatus.textContent = 'Încărcare document...';
            uploadStatus.style.color = '#007bff';

            // ***** OPȚIUNEA 1: SIMULARE (RECOMANDATĂ DACĂ NU AI BACKEND) *****
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulează o întârziere

                uploadStatus.textContent = `Fișierul "${file.name}" a fost încărcat cu succes (simulat)!`;
                uploadStatus.style.color = '#28a745';
                fileInput.value = ''; // Golește input-ul de fișier
                fileNameDisplay.textContent = 'Niciun fișier selectat';

            } catch (error) {
                uploadStatus.textContent = 'A apărut o eroare la încărcare (simulată). Verifică consola pentru detalii.';
                uploadStatus.style.color = '#dc3545';
                console.error('Eroare la simularea încărcării documentului:', error);
            }

        });
    }
});
// O parte din profile.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (restul codului de la începutul profile.js) ...

    // Referințe la elementele HTML pentru poza de profil
    const profilePicPreview = document.getElementById('profile-pic-preview');
    const profilePicInput = document.getElementById('profile-pic-input');
    const uploadProfilePicBtn = document.getElementById('upload-profile-pic-btn');
    const profilePicStatus = document.getElementById('profile-pic-status');

    // ... (restul referințelor la elemente HTML) ...

    // 4. Gestionarea pozei de profil (upload și previzualizare)
    // Inițializează previzualizarea cu poza existentă sau default
    if (profilePicPreview) {
        profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
    }

    // Deschide selectorul de fișiere la click pe imaginea de previzualizare
    if (profilePicPreview && profilePicInput) {
        profilePicPreview.addEventListener('click', () => {
            profilePicInput.click(); // Aceasta este cheia: declanșează click pe input-ul ascuns
        });

        // Previzualizează imaginea selectată și validează tipul/dimensiunea
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!validImageTypes.includes(file.type)) {
                    profilePicStatus.textContent = 'Selectează o imagine validă (jpg, png, gif).';
                    profilePicStatus.style.color = 'red';
                    profilePicInput.value = ''; // Resetează inputul
                    profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
                    return;
                }
                if (file.size > 2 * 1024 * 1024) { // Limită 2MB
                    profilePicStatus.textContent = 'Imaginea trebuie să fie mai mică de 2MB.';
                    profilePicStatus.style.color = 'red';
                    profilePicInput.value = '';
                    profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicPreview.src = e.target.result; // Previzualizează imaginea
                };
                reader.readAsDataURL(file);
                profilePicStatus.textContent = 'Fișier selectat. Apasă "Încarcă Poza" pentru a salva.';
                profilePicStatus.style.color = 'orange';
            } else {
                profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png'; // Revert la imaginea existentă
                profilePicStatus.textContent = 'Niciun fișier selectat.';
                profilePicStatus.style.color = '';
            }
        });
    }

    // Gestionarea încărcării (salvării) pozei de profil
    if (uploadProfilePicBtn) {
        uploadProfilePicBtn.addEventListener('click', async () => {
            const file = profilePicInput.files[0]; // Preia fișierul selectat
            if (!file) {
                profilePicStatus.textContent = 'Te rog selectează o poză înainte de a încărca.';
                profilePicStatus.style.color = 'red';
                return;
            }

            profilePicStatus.textContent = 'Încărcare poză...';
            profilePicStatus.style.color = '#007bff';
            uploadProfilePicBtn.disabled = true;

            try {
                // SIMULAREA ÎNCĂRCĂRII POZEI DE PROFIL
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulează o întârziere

                const simulatedProfilePicUrl = URL.createObjectURL(file); // Creează un URL temporar

                // Actualizează poza în localStorage pentru utilizatorul logat și în lista tuturor utilizatorilor
                loggedInUser.profilePicUrl = simulatedProfilePicUrl;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.email === loggedInUser.email);
                if (userIndex > -1) {
                    users[userIndex].profilePicUrl = simulatedProfilePicUrl;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                profilePicPreview.src = simulatedProfilePicUrl; // Actualizează imaginea afișată
                profilePicStatus.textContent = 'Poza de profil a fost actualizată!';
                profilePicStatus.style.color = 'green';
                profilePicInput.value = ''; // Golește inputul fișierului pentru a putea selecta din nou aceeași imagine
            } catch (error) {
                profilePicStatus.textContent = 'Eroare la încărcarea pozei (simulată). Te rog încearcă din nou.';
                profilePicStatus.style.color = 'red';
                console.error('Eroare la upload poza de profil (simulată):', error);
            } finally {
                uploadProfilePicBtn.disabled = false; // Reactivează butonul
            }
        });
    }

    // ... (restul codului din profile.js) ...
});
// profile.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Redirecționare dacă utilizatorul nu este logat
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'login.html'; // Redirecționează către pagina de logare
        return; // Oprește execuția ulterioară a scriptului
    }

    // Referințe la elementele HTML din pagina de profil
    const profileEmailSpan = document.getElementById('profile-email');
    const newUsernameInput = document.getElementById('new-username-input');
    const saveUsernameBtn = document.getElementById('save-username-btn');
    const usernameStatus = document.getElementById('username-status');

    const profilePicPreview = document.getElementById('profile-pic-preview'); // ID-ul corect din HTML
    const profilePicInput = document.getElementById('profile-pic-input');
    const uploadProfilePicBtn = document.getElementById('upload-profile-pic-btn'); // ID-ul corect din HTML
    const profilePicStatus = document.getElementById('profile-pic-status');

    const myEventsList = document.getElementById('my-events-list');
    const noEventsMsg = document.getElementById('no-events-msg');

    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const customUploadButton = document.getElementById('customUploadButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadStatus = document.getElementById('uploadStatus');

    // 2. Afișarea informațiilor de bază ale utilizatorului
    if (profileEmailSpan) {
        profileEmailSpan.textContent = loggedInUser.email;
    }
    if (newUsernameInput) {
        newUsernameInput.value = loggedInUser.username || '';
        newUsernameInput.addEventListener('input', () => {
            usernameStatus.textContent = '';
        });
    }

    // 3. Gestionarea salvării numelui de utilizator
    if (saveUsernameBtn) {
        saveUsernameBtn.addEventListener('click', async () => {
            const newUsername = newUsernameInput.value.trim();
            if (!newUsername) {
                usernameStatus.textContent = 'Numele de utilizator nu poate fi gol.';
                usernameStatus.style.color = 'red';
                return;
            }
            if (newUsername === (loggedInUser.username || '')) {
                usernameStatus.textContent = 'Noul nume este identic cu cel curent.';
                usernameStatus.style.color = 'orange';
                return;
            }

            saveUsernameBtn.disabled = true;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === loggedInUser.email);

            if (userIndex > -1) {
                const usernameExists = users.some(u => u.username === newUsername && u.email !== loggedInUser.email);
                if (usernameExists) {
                    usernameStatus.textContent = 'Acest nume de utilizator este deja folosit.';
                    usernameStatus.style.color = 'red';
                    saveUsernameBtn.disabled = false;
                    return;
                }

                users[userIndex].username = newUsername;
                loggedInUser.username = newUsername;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                usernameStatus.textContent = 'Numele a fost actualizat cu succes!';
                usernameStatus.style.color = 'green';
            } else {
                usernameStatus.textContent = 'Eroare: Utilizatorul nu a putut fi găsit.';
                usernameStatus.style.color = 'red';
            }
            saveUsernameBtn.disabled = false;
        });
    }

    // 4. Gestionarea pozei de profil
    if (profilePicPreview) {
        profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
    }

    if (profilePicPreview && profilePicInput) {
        profilePicPreview.addEventListener('click', () => {
            profilePicInput.click();
        });

        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!validImageTypes.includes(file.type)) {
                    profilePicStatus.textContent = 'Selectează o imagine validă (jpg, png, gif).';
                    profilePicStatus.style.color = 'red';
                    profilePicInput.value = '';
                    profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    profilePicStatus.textContent = 'Imaginea trebuie să fie mai mică de 2MB.';
                    profilePicStatus.style.color = 'red';
                    profilePicInput.value = '';
                    profilePicPreview.src = loggedInUser.profilePicUrl || 'images/default-profile.png';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicPreview.src = e.target.result;
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
    }

    if (uploadProfilePicBtn) {
        uploadProfilePicBtn.addEventListener('click', async () => {
            const file = profilePicInput.files[0];
            if (!file) {
                profilePicStatus.textContent = 'Te rog selectează o poză înainte de a încărca.';
                profilePicStatus.style.color = 'red';
                return;
            }

            profilePicStatus.textContent = 'Încărcare poză...';
            profilePicStatus.style.color = '#007bff';
            uploadProfilePicBtn.disabled = true;

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                const simulatedProfilePicUrl = URL.createObjectURL(file);

                loggedInUser.profilePicUrl = simulatedProfilePicUrl;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.email === loggedInUser.email);
                if (userIndex > -1) {
                    users[userIndex].profilePicUrl = simulatedProfilePicUrl;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                profilePicPreview.src = simulatedProfilePicUrl;
                profilePicStatus.textContent = 'Poza de profil a fost actualizată!';
                profilePicStatus.style.color = 'green';
                profilePicInput.value = '';
            } catch (error) {
                profilePicStatus.textContent = 'Eroare la încărcarea pozei (simulată). Te rog încearcă din nou.';
                profilePicStatus.style.color = 'red';
                console.error('Eroare la upload poza de profil (simulată):', error);
            } finally {
                uploadProfilePicBtn.disabled = false;
            }
        });
    }


    // 5. Afișarea tuturor evenimentelor publicate
    // (Aici am modificat logica de filtrare)
    if (myEventsList && noEventsMsg) {
        const allEvents = JSON.parse(localStorage.getItem('events')) || [];
        // Eliminăm filtrarea: const userEvents = allEvents.filter(event => event.creatorEmail === loggedInUser.email);
        const eventsToDisplay = allEvents; // Acum afișăm TOATE evenimentele

        if (eventsToDisplay.length > 0) {
            noEventsMsg.style.display = 'none';
            myEventsList.innerHTML = ''; // Curăță lista înainte de a adăuga
            eventsToDisplay.forEach(event => { // Folosim eventsToDisplay în loc de userEvents
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card');
                eventCard.setAttribute('data-event-id', event.id);
                eventCard.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>Data:</strong> ${event.date}</p>
                    <p><strong>Locație:</strong> ${event.location}</p>
                    <p>${event.description.substring(0, 100)}...</p>
                    <button class="view-event-btn" data-event-id="${event.id}">Vezi Detalii</button>
                    <button class="edit-event-btn" data-event-id="${event.id}">Editează</button>
                    <button class="delete-event-btn" data-event-id="${event.id}">Șterge</button>
                `;
                myEventsList.appendChild(eventCard);
            });

            // Adaugă event listener pentru butoanele "Vezi Detalii"
            myEventsList.querySelectorAll('.view-event-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventId = e.target.dataset.eventId;
                    alert(`Vei vedea detalii pentru evenimentul cu ID: ${eventId}`);
                });
            });

            // Logica pentru edit/delete ar trebui să permită ștergerea/editarea doar propriilor evenimente.
            // Aici, vom permite click-ul, dar ar trebui să adaugi o verificare suplimentară
            // pentru a permite acțiunea doar dacă `event.creatorEmail === loggedInUser.email`.
            myEventsList.querySelectorAll('.edit-event-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventId = e.target.dataset.eventId;
                    const eventToEdit = allEvents.find(event => event.id === eventId);
                    if (eventToEdit && eventToEdit.creatorEmail === loggedInUser.email) {
                        alert(`Editezi evenimentul cu ID: ${eventId}`);
                        // Redirecționează către pagina de adăugare eveniment cu ID-ul pentru pre-populare
                        // window.location.href = `adauga-eveniment.html?edit=${eventId}`;
                    } else {
                        alert('Nu ai permisiunea de a edita acest eveniment.');
                    }
                });
            });
            myEventsList.querySelectorAll('.delete-event-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventId = e.target.dataset.eventId;
                    const eventToDelete = allEvents.find(event => event.id === eventId);
                    if (eventToDelete && eventToDelete.creatorEmail === loggedInUser.email) {
                        if (confirm('Ești sigur că vrei să ștergi acest eveniment?')) {
                            let events = JSON.parse(localStorage.getItem('events')) || [];
                            events = events.filter(event => event.id !== eventId);
                            localStorage.setItem('events', JSON.stringify(events));
                            alert('Eveniment șters cu succes!');
                            location.reload();
                        }
                    } else {
                        alert('Nu ai permisiunea de a șterge acest eveniment.');
                    }
                });
            });

        } else {
            noEventsMsg.style.display = 'block';
        }
    }

    // 6. Gestionarea încărcării documentelor (Simulată)
    if (uploadForm && fileInput && customUploadButton && fileNameDisplay && uploadStatus) {
        customUploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
                uploadStatus.textContent = '';
            } else {
                fileNameDisplay.textContent = 'Niciun fișier selectat';
                uploadStatus.textContent = '';
            }
        });

        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const file = fileInput.files[0];
            if (!file) {
                uploadStatus.textContent = 'Te rugăm să selectezi un fișier.';
                uploadStatus.style.color = 'red';
                return;
            }

            uploadStatus.textContent = 'Încărcare document...';
            uploadStatus.style.color = '#007bff';

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                uploadStatus.textContent = `Fișierul "${file.name}" a fost încărcat cu succes (simulat)!`;
                uploadStatus.style.color = '#28a745';
                fileInput.value = '';
                fileNameDisplay.textContent = 'Niciun fișier selectat';

            } catch (error) {
                uploadStatus.textContent = 'A apărut o eroare la încărcare (simulată). Verifică consola pentru detalii.';
                uploadStatus.style.color = '#dc3545';
                console.error('Eroare la simularea încărcării documentului:', error);
            }
        });
    }
});