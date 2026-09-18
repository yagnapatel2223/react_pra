import React, { useState } from 'react';
import './StudentForm.css';

const StudentForm = ({ onAddStudent }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    course: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || Number(formData.age) <= 0) {
      newErrors.age = 'Age must be a valid positive number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.course) newErrors.course = 'Please select a course';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    
    if (Object.keys(formErrors).length === 0) {
      onAddStudent({
        ...formData,
        age: Number(formData.age)
      });
      // Reset form
      setFormData({ name: '', age: '', email: '', course: '' });
      setErrors({});
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="glass-card form-container">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit} noValidate>
        
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="John Doe"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input 
            type="number" 
            id="age" 
            name="age" 
            value={formData.age} 
            onChange={handleChange} 
            placeholder="20"
            className={errors.age ? 'input-error' : ''}
          />
          {errors.age && <span className="error-text">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="john@example.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course">Course</label>
          <select 
            id="course" 
            name="course" 
            value={formData.course} 
            onChange={handleChange}
            className={errors.course ? 'input-error' : ''}
          >
            <option value="">Select a course...</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Literature">Literature</option>
            <option value="Business">Business</option>
          </select>
          {errors.course && <span className="error-text">{errors.course}</span>}
        </div>

        <button type="submit" className="submit-btn">Enroll Student</button>
      </form>
    </div>
  );
};

export default StudentForm;
