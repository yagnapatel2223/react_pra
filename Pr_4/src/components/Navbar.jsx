import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">
          <span className="brand-icon">✨</span>
          <span className="brand-text">AeroSpace</span>
        </NavLink>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
