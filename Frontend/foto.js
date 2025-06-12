 const fileInput = document.getElementById('file-input');
        const uploadButton = document.getElementById('upload-button');
        const dropArea = document.getElementById('drop-area');
        const previewContainer = document.getElementById('preview-container');
        const loadingOverlay = document.getElementById('loading-overlay');
        const messageBox = document.getElementById('message-box');

        // Un array pentru a stoca fișierele de imagine selectate
        let selectedFiles = [];

        // Funcție pentru a afișa un mesaj temporar
        function showMessage(message, duration = 3000) {
            messageBox.textContent = message;
            messageBox.classList.add('show');
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, duration);
        }

        // Funcție pentru a afișa/ascunde spinner-ul de încărcare
        function showLoading(show) {
            if (show) {
                loadingOverlay.classList.add('visible');
            } else {
                loadingOverlay.classList.remove('visible');
            }
        }

        // Funcție pentru a crea previzualizări de imagini
        function createPreview(file) {
            // Verificăm dacă fișierul este o imagine
            if (!file.type.startsWith('image/')) {
                showMessage('Fișierul "' + file.name + '" nu este o imagine și a fost ignorat.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'relative group rounded-lg overflow-hidden shadow-md'; // Clasa pentru stilizare

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Previzualizare imagine';
                img.className = 'w-full h-32 object-cover rounded-lg'; // Dimensiuni și stil

                const removeButton = document.createElement('button');
                removeButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A8 8 0 111 12a8 8 0 0115 0z" />
                    </svg>
                `;
                removeButton.className = 'absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-red-500';
                removeButton.title = 'Elimină imaginea';

                removeButton.onclick = () => {
                    // Eliminăm fișierul din array-ul selectedFiles
                    selectedFiles = selectedFiles.filter(f => f !== file);
                    // Eliminăm elementul din DOM
                    imgContainer.remove();
                    showMessage('Imaginea a fost eliminată.');
                };

                imgContainer.appendChild(img);
                imgContainer.appendChild(removeButton);
                previewContainer.appendChild(imgContainer);
            };
            reader.readAsDataURL(file); // Citim fișierul ca URL de date
        }

        // Funcție pentru a gestiona fișierele selectate (fie prin buton, fie prin drag-and-drop)
        function handleFiles(files) {
            showLoading(true); // Afișează spinner-ul
            setTimeout(() => { // Simulăm o mică întârziere pentru vizualizarea spinner-ului
                for (const file of files) {
                    // Adăugăm fișierul în array-ul nostru
                    selectedFiles.push(file);
                    // Creăm previzualizarea
                    createPreview(file);
                }
                showMessage(`Au fost adăugate ${files.length} imagini.`);
                showLoading(false); // Ascunde spinner-ul
            }, 500); // Scurtă întârziere pentru efect vizual
        }

        // Ascultă evenimentul de click pe butonul de încărcare
        uploadButton.addEventListener('click', () => {
            fileInput.click(); // Declansează click-ul pe input-ul de tip fișier
        });

        // Ascultă evenimentul de schimbare a input-ului de tip fișier (când fișierele sunt selectate)
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFiles(e.target.files);
            }
        });

        // Gestionare drag-and-drop
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault(); // Previne comportamentul implicit (deschiderea fișierului)
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