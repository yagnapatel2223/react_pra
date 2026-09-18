import React from 'react';

const Header = ({ title, taskCount }) => {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      <p className="task-count">
        {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'} Remaining
      </p>
    </header>
  );
};

export default Header;
