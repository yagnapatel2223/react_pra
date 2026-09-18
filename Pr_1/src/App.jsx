import { useState } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Button from './components/Button';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Understand Functional Components', description: 'Learn how to use functions instead of classes in React.', completed: true },
    { id: 2, title: 'Master JSX syntax', description: 'Write HTML-like code directly in JavaScript.', completed: false },
    { id: 3, title: 'Build reusable components', description: 'Create modular pieces of UI that can be used everywhere.', completed: false },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const activeTaskCount = tasks.filter(task => !task.completed).length;

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDesc,
      completed: false
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <Header title="React Task Manager" taskCount={activeTaskCount} />
        
        <form className="task-form" onSubmit={addTask}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Task Title..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="task-input"
            />
            <input 
              type="text" 
              placeholder="Description (Optional)" 
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="task-input"
            />
          </div>
          <Button type="submit" variant="primary">Add Task</Button>
        </form>

        <TaskList 
          tasks={tasks} 
          onToggleStatus={toggleTaskStatus}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
