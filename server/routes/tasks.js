// Make sure your PUT route handles the task ID correctly
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Add validation
    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    // Your database update logic here
    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});