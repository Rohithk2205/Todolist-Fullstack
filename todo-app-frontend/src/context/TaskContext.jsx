import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';       // Import toast
import { api } from '../services/api';
import { setupNotifications, scheduleNotification } from '../services/notifications';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    setupNotifications();
    fetchTasks();
  }, [filter]);

  useEffect(() => {
    tasks.forEach(task => {
      scheduleNotification(task);
    });
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks', { params: filter });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks.');
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks([...tasks, response.data]);
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task.');
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await api.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map(task => task.id === id ? { ...task, ...taskData } : task));
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task.');
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      await updateTask(id, { is_completed: !task.is_completed });
      // Removed duplicate toast message to avoid conflicting messages
      // toast.info(`Task marked as ${task.is_completed ? 'incomplete' : 'complete'}.`);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast.error('Failed to toggle task completion.');
    }
  };

  const applyFilter = (filterData) => {
    setFilter(filterData);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      fetchTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      applyFilter
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
