import React, { useState } from 'react';
import './../Css/AddHospital.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function AddHospital({ onClose }) {
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    direction: '',
    image_url: '',
    disease: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get token from storage
  
    try {
      await axios.post('http://localhost:5000/hospitals', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to header
        },
      });
      alert('Hospital added successfully!');
      setFormData({ name: '', description: '', direction: '', image_url: '', disease: '' });
      onClose(); // Close the form
    } catch (error) {
      console.error(error);
      alert('Failed to add hospital');
    }
  };

  return (
    <div className="add-hospital-form">
      <h2>Add Hospital</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Hospital Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <textarea name="direction" placeholder="Direction" value={formData.direction} onChange={handleChange} required />
        <input type="text" name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} />
        <input type="text" name="disease" placeholder="Disease Treated" value={formData.disease} onChange={handleChange} required />
        <button type="submit">Add Hospital</button>
        <button type="button"  onClick={() => navigate('/admin-page')} className="cancel-button">Cancel</button>
      </form>
    </div>
  );
}
