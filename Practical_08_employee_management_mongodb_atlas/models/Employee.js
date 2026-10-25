const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 }, email: { type: String, required: true, trim: true, lowercase: true, unique: true }, department: { type: String, required: true, trim: true, maxlength: 80 }, salary: { type: Number, required: true, min: 0 }, hireDate: { type: Date, default: Date.now } }, { timestamps: true });
module.exports = mongoose.model('Employee', employeeSchema);
