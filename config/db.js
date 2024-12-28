const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Environment'a göre doğru .env dosyasını yükle
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.join(__dirname, '..', envFile) });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test bağlantısı
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database!');
    connection.release();
  } catch (error) {
    console.error('MySQL connection error:', error);
  }
};

testConnection();

module.exports = pool; 