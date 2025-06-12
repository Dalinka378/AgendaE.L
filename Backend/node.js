const express = require('express');
const { pool, testConnection } = require('./db-connection');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Această linie este crucială! Îi spune lui Express să servească fișierele statice
// (HTML, CSS, JS, imagini) din folderul 'Frontend' care se află un nivel mai sus.
app.use(express.static(__dirname + '/../Frontend'));


// Trimiterea fișierului index.html când se accesează URL-ul de bază
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/../Frontend/index.html');
});

app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users');
        res.json(rows);
    } catch (error) {
        console.error('Eroare la obținerea utilizatorilor:', error);
        res.status(500).send('Eroare la obținerea utilizatorilor');
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Tasks');
        res.json(rows);
    } catch (error) {
        console.error('Eroare la obținerea sarcinilor:', error);
        res.status(500).send('Eroare la obținerea sarcinilor');
    }
});

app.listen(PORT, async () => {
    await testConnection();
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});