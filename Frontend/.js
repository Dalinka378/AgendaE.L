// Exemplu în Frontend JavaScript (ex: într-un fișier JS asociat cu login.html)

async function handleLogin(username, password) {
    try {
        const response = await fetch('http://localhost:3000/api/login', { // Aici vei pune adresa serverului tău backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json(); // Așteaptă răspunsul JSON

        if (response.ok) { // Status HTTP 2xx
            console.log('Login reușit!', data);
            // Salvează token-ul și redirecționează
        } else {
            console.error('Eroare la login:', data.message);
            // Afișează mesaj de eroare utilizatorului
        }
    } catch (error) {
        console.error('Eroare rețea sau server:', error);
        // Afișează eroare utilizatorului
    }
}

// Pentru încărcare imagini (cum am discutat anterior):
async function uploadImages(files) {
    const formData = new FormData();
    files.forEach((file, index) => {
        formData.append(`image${index}`, file);
    });

    try {
        const response = await fetch('http://localhost:3000/api/upload-foto', { // Aici vei pune adresa serverului tău backend
            method: 'POST',
            body: formData, // Nu seta 'Content-Type' pentru FormData, browserul o face automat
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Imagini încărcate cu succes!', data);
        } else {
            console.error('Eroare la încărcarea imaginilor:', data.message);
        }
    } catch (error) {
        console.error('Eroare rețea sau server:', error);
    }
}