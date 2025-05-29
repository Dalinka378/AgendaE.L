const express = require('express');
const { pool, testConnection } = require('./db-connection');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bine ai venit la Task Manager API!');
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
