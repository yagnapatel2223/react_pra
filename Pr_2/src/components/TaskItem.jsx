import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <label className="checkbox-container">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={onToggle} 
        />
        <span className="checkmark"></span>
      </label>
      
      <span className="task-text">{task.text}</span>
      
      <button className="delete-btn" onClick={onDelete} aria-label="Delete task">
        ✕
      </button>
    </div>
  );
};

export default TaskItem;
