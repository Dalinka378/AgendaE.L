document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    const profileEmailSpan = document.getElementById('profile-email');
    const newUsernameInput = document.getElementById('new-username-input');
    const saveUsernameBtn = document.getElementById('save-username-btn');
    const usernameStatus = document.getElementById('username-status');

    if (profileEmailSpan) profileEmailSpan.textContent = loggedInUser.email;
    if (newUsernameInput) {
        newUsernameInput.value = loggedInUser.username;
        newUsernameInput.addEventListener('input', () => {
            usernameStatus.textContent = '';
        });
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
            }

            saveUsernameBtn.disabled = false;
        });
    }

    const profilePicPreview = document.getElementById('profile-pic-preview');
    const profilePicInput = document.getElementById('profile-pic-input');
    const uploadProfilePicBtn = document.getElementById('upload-profile-pic-btn');
    const profilePicStatus = document.getElementById('profile-pic-status');

    if (profilePicPreview && loggedInUser.profilePicUrl) {
        profilePicPreview.src = loggedInUser.profilePicUrl;
    }

    if (profilePicPreview && profilePicInput && uploadProfilePicBtn) {
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

            const formData = new FormData();
            formData.append('profilePic', file);

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
                profilePicStatus.textContent = 'Eroare la încărcarea pozei. Te rog încearcă din nou.';
                profilePicStatus.style.color = 'red';
                console.error('Eroare la upload poza de profil:', error);
            }

            uploadProfilePicBtn.disabled = false;
        });
    }

    const myEventsList = document.getElementById('my-events-list');
    const noEventsMsg = document.getElementById('no-events-msg');

    if (myEventsList && noEventsMsg) {
        const allEvents = JSON.parse(localStorage.getItem('events')) || [];
        const userEvents = allEvents.filter(event => event.creatorEmail === loggedInUser.email);

        if (userEvents.length > 0) {
            noEventsMsg.style.display = 'none';
            myEventsList.innerHTML = '';
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
            noEventsMsg.style.display = 'block';
        }
    }

    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const customUploadButton = document.getElementById('customUploadButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadStatus = document.getElementById('uploadStatus');

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

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload-document', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    uploadStatus.textContent = `Fișierul "${result.fileName || file.name}" a fost încărcat cu succes!`;
                    uploadStatus.style.color = '#28a745';
                    fileInput.value = '';
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
const inputFile = document.getElementById('profile-pic-input');
const uploadBtn = document.getElementById('upload-btn');
const imgPreview = document.getElementById('profile-preview');

uploadBtn.addEventListener('click', () => {
  inputFile.click();
});

inputFile.addEventListener('change', () => {
  const file = inputFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      imgPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

    imgPreview.addEventListener("click", () => {
      inputFile.click();
    });
