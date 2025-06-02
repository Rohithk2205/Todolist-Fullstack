import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const { applyFilter } = useTaskContext();

  const handleApply = () => {
    applyFilter({
      date: date || null,
      status: status || null
    });
    setIsOpen(false);
  };

  const clearFilters = () => {
    setDate('');
    setStatus('');
    applyFilter({});
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg"
      >
        <span>Filter</span>
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-10 p-5 border border-gray-200">
          <h3 className="font-medium text-lg mb-4 text-gray-800">Find fast. Dates, time, status. Instant.</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all"
                  name="status"
                  checked={status === ''}
                  onChange={() => setStatus('')}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="all" className="ml-2 text-sm text-gray-700">All Tasks</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="completed"
                  name="status"
                  checked={status === 'completed'}
                  onChange={() => setStatus('completed')}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="completed" className="ml-2 text-sm text-gray-700">Completed</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pending"
                  name="status"
                  checked={status === 'pending'}
                  onChange={() => setStatus('pending')}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="pending" className="ml-2 text-sm text-gray-700">Pending</label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
