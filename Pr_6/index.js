const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory data store for students
let students = [
  { id: 1, name: 'Alice Smith', age: 20, email: 'alice@example.com', course: 'Computer Science' },
  { id: 2, name: 'Bob Johnson', age: 22, email: 'bob@example.com', course: 'Mathematics' }
];

// Helper function to generate unique IDs
const generateId = () => {
  return students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
};

// GET /api/students - Get all students
app.get('/api/students', (req, res) => {
  res.json(students);
});

// GET /api/students/:id - Get a specific student
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }
  
  res.json(student);
});

// POST /api/students - Add a new student
app.post('/api/students', (req, res) => {
  const { name, age, email, course } = req.body;
  
  // Basic validation
  if (!name || !age || !email || !course) {
    return res.status(400).json({ message: 'Please provide name, age, email, and course.' });
  }
  
  const newStudent = {
    id: generateId(),
    name,
    age: parseInt(age),
    email,
    course
  };
  
  students.push(newStudent);
  res.status(201).json({
    message: 'Student created successfully',
    student: newStudent
  });
});

// PUT /api/students/:id - Update an existing student
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, age, email, course } = req.body;
  
  const studentIndex = students.findIndex(s => s.id === id);
  
  if (studentIndex === -1) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }
  
  const updatedStudent = {
    ...students[studentIndex],
    ...(name && { name }),
    ...(age && { age: parseInt(age) }),
    ...(email && { email }),
    ...(course && { course })
  };
  
  students[studentIndex] = updatedStudent;
  
  res.json({
    message: 'Student updated successfully',
    student: updatedStudent
  });
});

// DELETE /api/students/:id - Delete a student
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(s => s.id === id);
  
  if (studentIndex === -1) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }
  
  const deletedStudent = students.splice(studentIndex, 1);
  
  res.json({
    message: 'Student deleted successfully',
    student: deletedStudent[0]
  });
});

app.listen(PORT, () => {
  console.log(`Student Records API Server is running on http://localhost:${PORT}`);
});
