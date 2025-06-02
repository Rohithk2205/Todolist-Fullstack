const { pool } = require('../models/db');

exports.getAllTasks = async (req, res) => {
  try {
    const { date, status } = req.query;
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.user.id];

    if (date) {
      query += ' AND due_date = ?';
      params.push(date);
    }

    if (status === 'completed') {
      query += ' AND is_completed = 1';
    } else if (status === 'pending') {
      query += ' AND is_completed = 0';
    }

    query += ' ORDER BY due_date, due_time';

    const [tasks] = await pool.execute(query, params);
    res.json(tasks);
  } catch (err) {
    console.error('Error in updateTask:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, due_date, due_time, repeat_type, reminder } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO tasks SET ?`,
      {
        user_id: req.user.id,
        title,
        description,
        due_date,
        due_time,
        repeat_type,
        reminder
      }
    );
    
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
console.log('Update task route called with:', req.body);
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const fields = ['title', 'description', 'due_date', 'due_time', 'repeat_type', 'reminder', 'is_completed'];
    const updates = [];
    const values = [];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (field === 'is_completed') {
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

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Error in updateTask:', err);
    res.status(500).json({ error: err.message });
  }
};
