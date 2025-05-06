// src/components/FeedbackList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Css/FeedbackList.css'; // Make sure the CSS is properly scoped and imported

export default function FeedbackList({ onClose }) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/admin/feedback', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback(res.data.feedback);
    };
    fetchFeedback();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="user-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">Vaidyakiya sahayaka</span>
        </div>
        <div className="nav-right">
          <span>{user?.email}</span>
          <button  onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="feedback-modal">
      <button  className="feed-btn" onClick={() => navigate('/admin-page')}>Close</button>
        <h2  id='feedback-text'>User Feedback</h2>

        <div className="feedback-list">
          {feedback.length === 0 ? (
            <p>No feedback submitted yet.</p>
          ) : (
            feedback.map((entry, index) => (
              <div key={index} className="feedback-entry">
                <div className="feedback-header">
                  <strong>{entry.email}</strong>
                  <em>({formatDate(entry.created_at)})</em>
                </div>
                <div className="feedback-message">{entry.message}</div>
                <hr />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
