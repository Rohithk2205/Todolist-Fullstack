import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Parse date string as local date to avoid timezone shift
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

const EditTask = ({ task, onClose }) => {
  const { updateTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    due_date: formatDateForInput(task.due_date),
    due_time: task.due_time || '',
    repeat_type: task.repeat_type || 'none',
    reminder: task.reminder || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format due_date to yyyy-MM-dd before sending
    const formattedData = {
      ...formData,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0] : '',
    };
    updateTask(task.id, formattedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Modify to-do</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Tell us about your task"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="due_time" className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  id="due_time"
                  name="due_time"
                  type="time"
                  value={formData.due_time}
                  onChange={(e) => setFormData({...formData, due_time: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="repeat_type" className="block text-sm font-medium text-gray-700">Repeat</label>
              <select
                id="repeat_type"
                name="repeat_type"
                value={formData.repeat_type}
                onChange={(e) => setFormData({...formData, repeat_type: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="none">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="biweekly">Every two weeks</option>
                <option value="bimonthly">Every two months</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half yearly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="reminder"
                name="reminder"
                type="checkbox"
                checked={formData.reminder}
                onChange={(e) => setFormData({...formData, reminder: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="reminder" className="ml-2 text-sm text-gray-700">Set Reminder</label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;