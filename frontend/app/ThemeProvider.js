'use client';

import { useState, useEffect } from 'react';

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Trip Planner</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-6 py-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow-md mt-auto">
        <div className="container mx-auto px-6 py-3 text-center text-gray-600 dark:text-gray-400">
          © 2023 Trip Planner. All rights reserved.
        </div>
      </footer>
    </div>
  );
}