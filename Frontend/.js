const BACKEND_URL = 'http://localhost:3000/api';

async function checkServerStatus() {
    try {
        const response = await fetch(`${BACKEND_URL}/status`);
        const data = await response.json();
        if (response.ok) {
            console.log('Status server:', data.message);
        } else {
            console.error('Eroare status server:', data.message);
        }
    } catch (error) {
        console.error('Eroare rețea la verificarea statusului serverului:', error);
    }
}

async function handleLogin(username, password) {
    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login reușit!', data);
            localStorage.setItem('loggedInUser', JSON.stringify({
                email: username,
                username: data.username,
                token: data.token
            }));
            window.location.href = 'evenimente.html';
            return true;
        } else {
            console.error('Eroare la login:', data.message);
            alert(`Eroare la login: ${data.message}`);
            return false;
        }
    } catch (error) {
        console.error('Eroare rețea sau server la login:', error);
        alert('Eroare de conexiune la server. Încearcă mai târziu.');
        return false;
    }
}

async function uploadImages(files) {
    const formData = new FormData();
    files.forEach((file, index) => {
        formData.append(`image${index}`, file);
    });

    try {
        const response = await fetch(`${BACKEND_URL}/upload-foto`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Imagini încărcate cu succes!', data.imageUrls);
            return data.imageUrls;
        } else {
            console.error('Eroare la încărcarea imaginilor:', data.message);
            alert(`Eroare la încărcarea imaginilor: ${data.message}`);
            return null;
        }
    } catch (error) {
        console.error('Eroare rețea sau server la încărcarea imaginilor:', error);
        alert('Eroare de conexiune la server pentru încărcarea imaginilor.');
        return null;
    }
}