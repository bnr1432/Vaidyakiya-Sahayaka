// Pages/Feedback.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';  
import './../Css/Feedback.css';  
import { useNavigate } from 'react-router-dom';



export default function Feedback() {
    const navigate = useNavigate();
  
  const [feedback, setFeedback] = useState('');
  const { user, logout } = useAuth();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/feedback', { message: feedback }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Feedback submitted successfully!');
      setFeedback('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Submission failed.');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Redirect to homepage
  };

  return (
    <div className="user-page">
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

      <div className="feedback-page">
        <h2>Submit Feedback</h2>
        <button className="back-button" onClick={() => navigate('/user-page')}>
          ← Back
        </button>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
