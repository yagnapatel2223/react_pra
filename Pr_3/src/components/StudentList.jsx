import React from 'react';
import './StudentList.css';

const StudentList = ({ students, onDeleteStudent }) => {
  return (
    <div className="glass-card list-container">
      <h2>Enrolled Students <span className="badge">{students.length}</span></h2>
      
      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No students enrolled yet.</p>
          <p className="empty-subtext">Add a student using the form to get started.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Course</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td className="font-medium">{student.name}</td>
                  <td>{student.age}</td>
                  <td className="text-muted">{student.email}</td>
                  <td>
                    <span className="course-chip">{student.course}</span>
                  </td>
                  <td>
                    <button 
                      className="delete-action" 
                      onClick={() => onDeleteStudent(student.id)}
                      title="Remove Student"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
