import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../Css/Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    age: '', address: '', gender: '', bloodGroup: '',
    password: '', confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match');
    }
    try {
      await axios.post('http://localhost:5000/register', formData);
      alert('Registered Successfully');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '', lastName: '', email: '', mobile: '',
      age: '', address: '', gender: '', bloodGroup: '',
      password: '', confirmPassword: ''
    });
  };

  return (
    <div className="Register-container">
      <div className="Register-left">
        <div className="left-text">
          <h2>Nice to see you again</h2>
          <h1>WELCOME BACK</h1>
          <h1>VAIDYAKIYA <span id="s-name">SAHAYAKA</span></h1>
        </div>
      </div>
      <div className="Register-right">
        <h2>Register Account</h2>
        <p>VAIDYAKIYA SAHAYAKA</p>
        <form className="Register-form" onSubmit={handleSubmit}>
          <label>First Name:</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} required />

          <label>Last Name:</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} required />

          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />

          <label>Mobile Number:</label>
          <input name="mobile" value={formData.mobile} onChange={handleChange} required />

          <label>Age:</label>
          <input name="age" type="number" value={formData.age} onChange={handleChange} required />

          <label>Address:</label>
          <input name="address" value={formData.address} onChange={handleChange} required />

          <div className="side-by-side">
            <div>
              <label>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label>Blood Group:</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <label>Password:</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />

          <label>Confirm Password:</label>
          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />

          <div className="btn-group">
            <button type="submit">Register</button>
            <button type="button" onClick={handleReset}>Reset</button>
            <button type="button" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </form>
      </div>
    </div>
  );
}
