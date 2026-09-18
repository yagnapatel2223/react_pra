const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide employee name'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Please provide employee position'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please provide department'],
  },
  salary: {
    type: Number,
    required: [true, 'Please provide salary']
  },
  hireDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
