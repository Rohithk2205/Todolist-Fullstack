require('./services/scheduler');
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Health Check Endpoint
app.get('/api/healthcheck', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ 
      status: 'API is working', 
      database: rows[0].solution === 2 ? 'Connected' : 'Error' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task Routes (Protected)
app.use('/api/tasks', authenticateToken);

// Get all tasks for user with optional filters
app.get('/api/tasks', async (req, res) => {
  try {
    const { date, status } = req.query;
    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.user.id];

    if (date) {
      sql += ' AND due_date = ?';
      params.push(date);
    }

    if (status === 'completed') {
      sql += ' AND is_completed = 1';
    } else if (status === 'pending') {
      sql += ' AND is_completed = 0';
    }

    sql += ' ORDER BY due_date, due_time';

    const [tasks] = await pool.execute(sql, params);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, due_date, due_time, repeat_type, reminder } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO tasks 
      (user_id, title, description, due_date, due_time, repeat_type, reminder) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, description, due_date, due_time, repeat_type, reminder]
    );
    
    const [newTask] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newTask[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const fields = ['title', 'description', 'due_date', 'due_time', 'repeat_type', 'reminder', 'is_completed'];
    const updates = [];
    const values = [];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (field === 'is_completed' || field === 'reminder') {
          values.push(req.body[field] ? 1 : 0);
        } else {
          values.push(req.body[field]);
        }
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(taskId, req.user.id);

    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;

    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    
    await pool.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, req.user.id]
    );
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});