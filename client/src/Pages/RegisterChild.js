import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../Css/RegisterChild.css';
import { useAuth } from './AuthContext';

export default function RegisterChild() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    bloodGroup: '',
    mobile: '',
    gender: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/register-child', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Sending token as Bearer token in the header
      },
      body: JSON.stringify({
        ...formData
      })
    });

    if (response.ok) {
      alert('Child registered successfully!');
      navigate('/user-page');
    } else {
      const error = await response.json();
      alert(error.message || 'Registration failed');
    }
  };

  return (
    <div className="register-child-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">Vaidyakiya Sahayaka</span>
        </div>
        <div className="nav-right">
          <span>{user?.email}</span>
          <span className="support">Support</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="register-container">
        <button className="back-button" onClick={() => navigate('/user-page')}>
          ← Back
        </button>
        <h2>Register Your Child</h2>

        <div className="register-card">
          <form onSubmit={handleSubmit} className="register-form">
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <input type="text" name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleChange} required />
            <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit">Register Child</button>
          </form>
        </div>
      </div>
    </div>
  );
}
