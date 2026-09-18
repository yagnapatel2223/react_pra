import React from 'react';
import './Header.css';

const Header = ({ theme, onToggleTheme }) => {
  return (
    <header className="header">
      <div>
        <h1 className="title">Vibrance Tasks</h1>
        <p className="subtitle">Manage your workflow beautifully.</p>
      </div>
      <button className="theme-toggle" onClick={onToggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

export default Header;
