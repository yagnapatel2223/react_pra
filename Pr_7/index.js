require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Employee = require('./models/Employee');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("WARNING: MONGO_URI is not defined in .env file. Please add it and restart the server.");
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();

// --- API ROUTES ---

// @route   GET /api/employees
// @desc    Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ hireDate: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/employees/:id
// @desc    Get single employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    // If the ID is invalid (not a valid ObjectId)
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/employees
// @desc    Create a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, position, department, salary } = req.body;
    
    const newEmployee = new Employee({
      name,
      position,
      department,
      salary
    });

    const employee = await newEmployee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error creating employee', error: error.message });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update an employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { name, position, department, salary } = req.body;
    
    // Build update object dynamically
    const employeeFields = {};
    if (name) employeeFields.name = name;
    if (position) employeeFields.position = position;
    if (department) employeeFields.department = department;
    if (salary) employeeFields.salary = salary;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: employeeFields },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(400).json({ message: 'Error updating employee', error: error.message });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ message: 'Employee removed successfully', employee });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Employee Management API running on http://localhost:${PORT}`);
});
