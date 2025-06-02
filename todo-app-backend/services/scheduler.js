const cron = require('node-cron');
const { pool } = require('../models/db');

cron.schedule('0 0 * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    await pool.execute(
      'DELETE FROM tasks WHERE is_completed = 1 AND created_at < ?',
      [yesterday]
    );
    
    console.log('Completed tasks cleanup executed');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

module.exports = cron;