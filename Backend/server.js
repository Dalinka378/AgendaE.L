const express = require('express');
const { pool, testConnection } = require('./db-connection');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const UPLOAD_DIR = path.join(__dirname, '..', 'Frontend', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '..', 'Frontend')));
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
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

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (username === 'test' && password === 'parola') {
        res.json({ message: 'Login reușit!', token: 'dummy-token-123', username: username });
    } else {
        res.status(401).json({ message: 'Nume utilizator sau parolă incorecte.' });
    }
});

app.post('/api/upload-foto', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Niciun fișier imagine nu a fost încărcat.' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    res.json({ message: 'Imagini încărcate cu succes!', imageUrls: imageUrls });
});

app.post('/api/upload-document', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Niciun document nu a fost încărcat.' });
    }

    const documentUrl = `/uploads/${req.file.filename}`;

    res.json({ message: 'Document încărcat cu succes!', documentUrl: documentUrl });
});

app.listen(PORT, async () => {
    await testConnection();
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});