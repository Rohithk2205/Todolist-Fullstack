const updateTask = async (id, taskData) => {
  try {
    console.log('Updating task:', id, taskData); // Debug log
    const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, taskData);
    
    // Update your state here
    setTasks(tasks.map(task => 
      task.id === id ? response.data : task
    ));
    
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    throw error;
  }
};