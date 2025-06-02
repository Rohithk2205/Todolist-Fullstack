const { pool } = require('./db');

class Task {
  static async create(userId, taskData) {
    const { title, description, due_date, due_time, repeat_type, reminder } = taskData;
    const [result] = await pool.execute(
      `INSERT INTO tasks 
      (user_id, title, description, due_date, due_time, repeat_type, reminder) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description, due_date, due_time, repeat_type, reminder]
    );
    return result.insertId;
  }

  static async update(id, userId, taskData) {
    const { title, description, due_date, due_time, is_completed, repeat_type, reminder } = taskData;
    await pool.execute(
      `UPDATE tasks SET 
      title = ?, description = ?, due_date = ?, due_time = ?, 
      is_completed = ?, repeat_type = ?, reminder = ?
      WHERE id = ? AND user_id = ?`,
      [title, description, due_date, due_time, is_completed, 
       repeat_type, reminder, id, userId]
    );
  }

  static async delete(id, userId) {
    await pool.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date, due_time',
      [userId]
    );
    return rows;
  }
}

module.exports = Task;