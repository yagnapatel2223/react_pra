import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onToggleStatus, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
