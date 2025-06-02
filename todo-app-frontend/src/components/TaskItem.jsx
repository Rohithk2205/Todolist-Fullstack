import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import EditTask from './EditTask';

const TaskItem = ({ task }) => {
  const { toggleComplete, deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    return hour > 12
      ? `${hour - 12}:${minutes} PM`
      : `${hour}:${minutes} AM`;
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors flex items-start group">
      <div className="flex items-center h-5 mt-1">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={() => toggleComplete(task.id)}
          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <h3
          className={`text-base font-medium ${
            task.is_completed
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-500 mt-1 truncate">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex items-center text-xs text-gray-400">
          {task.due_date && (
            <span className="flex items-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {task.due_date}
            </span>
          )}
          {task.due_time && (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatTime(task.due_time)}
            </span>
          )}
        </div>
      </div>

      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {isEditing && (
        <EditTask task={task} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
};

export default TaskItem;