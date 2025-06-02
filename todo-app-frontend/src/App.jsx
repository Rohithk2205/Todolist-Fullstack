import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import Filter from './components/Filter';
import NotificationSettings from './components/NotificationSettings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={() => navigate('/login')} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
        <header className="text-center mb-8 sm:mb-12 flex flex-col items-center">
          {/* Logo space */}
          <div className="mb-4">
            <img src="https://imgs.search.brave.com/dAtQ-Tu8c3aFFS9Zk-U9yf0aLXdD1CWJhUaQjvW-ipA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzgxLzAx/LzI2LzgxMDEyNjg1/Mzc5MzM1OGFjNjll/N2ExNjE2NmUwZmI2/LmpwZw" alt="Logo" className="w-16 h-16 rounded-full" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Organize, Remind, Achieve.
            <span className="block mt-1 sm:mt-2 text-blue-600">Do it all.</span>
          </h1>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </header>
        <ToastContainer />
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-200" style={{ overflow: 'visible' }}>
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b" style={{ overflow: 'visible' }}>
            <div className="flex items-center gap-3" style={{ position: 'relative', overflow: 'visible' }}>
              <h2 className="text-xl font-semibold text-gray-800"> Today</h2>
              <Filter />
            </div>
            <AddTask />
          </div>
          <TaskList />
        </div>
        <NotificationSettings />
      </div>
    </TaskProvider>
  );
}

export default App;
