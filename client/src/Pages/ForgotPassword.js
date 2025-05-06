// src/components/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './../Css/ForgotPassword.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';



export default function ForgotPassword() {
      const navigate = useNavigate();

    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate('/');
      };
    
    const [mobile, setMobile] = useState('');
    const [newPassword, setNewPassword] = useState('');
  
    const resetPassword = async () => {
      try {
        await axios.post('http://localhost:5000/reset-password', { mobile, newPassword });
        alert('Password reset successful');
      } catch (err) {
        alert(err.response?.data?.message || 'Error resetting password');
      }
    };
  
    return (
        <div className="user-page">
        <nav className="navbar">
          <div className="nav-left">
            <span className="logo">Vaidyakiya sahayaka</span>
          </div>
          <div className="nav-right">
            <span>{user?.email}</span>
            <span className="support">Support</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <input
          type="text"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button onClick={resetPassword}>Reset Password</button>
        <button onClick={() => navigate('/login')} style={{ marginTop: '10px' }}>Back to Login</button> {/* Back to Login button */}

      </div>
      </div>


    );
  }
  