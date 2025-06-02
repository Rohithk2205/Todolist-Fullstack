import Push from 'push.js';

export const setupNotifications = () => {
  if (!Push.Permission.has()) {
    Push.Permission.request();
  }
};

export const showNotification = (title, options) => {
  if (!Push.Permission.has()) return;
  
  Push.create(title, {
    body: options.body,
    icon: '/notification-icon.png',
    timeout: 5000,
    onClick: () => {
      window.focus();
      this.close();
    }
  });
};

export const scheduleNotification = (task) => {
  if (!task.reminder || task.is_completed) return;
  
  const dueDateTime = new Date(`${task.due_date}T${task.due_time}`);
  const now = new Date();
  const timeDiff = dueDateTime - now;
  
  if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      showNotification('Task Reminder', {
        body: `${task.title} is due soon`
      });
    }, timeDiff - 60000); // 1 minute before
  }
};