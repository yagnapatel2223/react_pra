import { useState } from 'react';
import './App.css';
import TaskBoard from './components/TaskBoard';
import Header from './components/Header';

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    // Using simple state to toggle simple theme property
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <main className="glass-panel">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <TaskBoard />
      </main>
    </div>
  );
}

export default App;
