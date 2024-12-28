const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Login endpoint'i
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const [users] = await db.query(
      'SELECT username, isAdmin FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (users.length > 0) {
      res.json({ 
        success: true, 
        message: 'Giriş başarılı',
        user: {
          username: users[0].username,
          isAdmin: users[0].isAdmin
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Geçersiz kullanıcı adı veya şifre' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Giriş işlemi sırasında bir hata oluştu' 
    });
  }
});

// Kullanıcı ekleme endpoint'i
app.post('/api/users', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  
  try {
    await db.query(
      'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
      [username, password, isAdmin || false]
    );
    
    res.json({ 
      success: true, 
      message: 'Kullanıcı başarıyla oluşturuldu' 
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kullanıcı oluşturulurken bir hata oluştu' 
    });
  }
});

// Kullanıcıları listeleme endpoint'i (sadece admin kullanıcıları için)
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, isAdmin, created_at FROM users'
    );
    
    res.json({ users });
  } catch (error) {
    console.error('Users listing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kullanıcılar listelenirken bir hata oluştu' 
    });
  }
});

// Remote config endpoint'leri
app.get('/api/remote-configs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Value FROM RemoteConfigs WHERE Id = 1');
    const value = rows[0]?.Value === 1;
    res.json({ value });
  } catch (error) {
    console.error('Config fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Config değeri alınırken bir hata oluştu' 
    });
  }
});

app.post('/api/remote-configs', async (req, res) => {
  const { value } = req.body;
  try {
    const dbValue = value ? 1 : 0;
    await db.query(
      'INSERT INTO RemoteConfigs (Id, Value) VALUES (1, ?) ON DUPLICATE KEY UPDATE Value = ?',
      [dbValue, dbValue]
    );
    res.json({ value: Boolean(dbValue) });
  } catch (error) {
    console.error('Config update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Config değeri güncellenirken bir hata oluştu' 
    });
  }
});

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 as test');
    res.json({ 
      message: 'Backend API is working!',
      dbConnection: 'Database connection successful!',
      test: rows[0].test 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error occurred!', 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 