import React from 'react';
import Button from './Button';

const TaskCard = ({ task, onToggleStatus, onDelete }) => {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
      </div>
      <div className="task-actions">
        <Button 
          variant={task.completed ? "secondary" : "success"} 
          onClick={() => onToggleStatus(task.id)}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </Button>
        <Button 
          variant="danger" 
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
