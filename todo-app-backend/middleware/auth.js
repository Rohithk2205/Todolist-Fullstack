const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0) {
      return res.sendStatus(403);
    }
    
    req.user = users[0];
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};