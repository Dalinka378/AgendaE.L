// db-connection.js
const mysql = require('mysql2/promise');

// Crearea unui pool de conexiuni
const pool = mysql.createPool({
  host: 'localhost', // gazda bazei de date
  user: 'admin', // utilizatorul bazei de date
  password: 'root', // parola bazei de date
  database: 'TaskManagerDB', // numele bazei de date
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexiune la baza de date realizata cu succes!');
    connection.release();
  } catch (error) {
    console.error('Eroare la conectarea la baza de date:', error);
  }
}

module.exports = {
  pool,
  testConnection
};