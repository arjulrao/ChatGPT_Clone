import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// Apply initial theme as early as possible to avoid flash of unthemed content.
const saved = localStorage.getItem('theme');
const initialTheme = saved || 'dark';
document.documentElement.setAttribute('data-theme', initialTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)