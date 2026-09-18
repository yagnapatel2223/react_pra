import { useState } from 'react';
import './App.css';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

function App() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Smith', age: 20, email: 'alice@example.com', course: 'Computer Science' },
    { id: 2, name: 'Bob Johnson', age: 22, email: 'bob@example.com', course: 'Mathematics' },
  ]);

  const addStudent = (student) => {
    setStudents([...students, { ...student, id: Date.now() }]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div className="app-container">
      <div className="header-section">
        <h1 className="title">Student Hub</h1>
        <p className="subtitle">Manage enrollments and student data efficiently.</p>
      </div>

      <StudentForm onAddStudent={addStudent} />
      <StudentList students={students} onDeleteStudent={deleteStudent} />
    </div>
  );
}

export default App;
