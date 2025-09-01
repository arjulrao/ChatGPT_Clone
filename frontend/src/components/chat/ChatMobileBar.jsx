import React from 'react';
import './ChatMobileBar.css';
import './ChatLayout.css';


const ChatMobileBar = ({ onToggleSidebar }) => (
  <header className="chat-mobile-bar">
    <button type="button" className="chat-icon-btn" onClick={onToggleSidebar} aria-label="Toggle chat history">☰</button>
    <div className="chat-app-title">
      <div className="title">NeoBot</div>
      <div className="tagline">Talk Smart. Think Faster.</div>
    </div>
  {/* New chat plus button removed per request */}
  </header>
);

export default ChatMobileBar;