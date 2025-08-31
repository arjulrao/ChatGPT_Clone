import React, { useEffect, useState } from 'react';

const ThemeToggle = ({ className = '', global = false }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }

  const classes = ['theme-toggle', className];
  if (global) classes.push('global');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={classes.filter(Boolean).join(' ')}
      aria-pressed={theme === 'dark'}
      aria-label={theme === 'light' ? 'Activate dark mode' : 'Activate light mode'}
      title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
    >
      <span aria-hidden>{theme === 'light' ? '🌙' : '☀️'}</span>
    </button>
  );
};

export default ThemeToggle;