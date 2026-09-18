import React, { useState } from 'react';
import TaskItem from './TaskItem';
import './TaskBoard.css';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Design the new glassmorphic UI', completed: false },
    { id: 2, text: 'Implement state management', completed: true },
    { id: 3, text: 'Add interactive animations', completed: false },
  ]);
  
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="task-board">
      <form className="task-form" onSubmit={handleAddTask}>
        <input 
          type="text" 
          className="task-input" 
          placeholder="What needs to be done?" 
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit" className="add-btn">
          Add Task
        </button>
      </form>

      <div className="task-list">
        {tasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={() => toggleTask(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="empty-state">
            <p>You're all caught up! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
