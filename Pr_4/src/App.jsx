import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
