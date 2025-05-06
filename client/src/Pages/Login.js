import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../Css/Login.css';
import { useAuth } from './AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- make sure this is used

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });

      localStorage.setItem('token', res.data.token); //Save token here

      // Store user info using AuthContext
      login({
        email,
        role: res.data.role,
        userId: res.data.userId,
      });

      alert(`Logged in as ${res.data.role}`);
      if (res.data.role === 'admin') navigate('/admin-page');
      else navigate('/user-page');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="left-text">
          <h2>Nice to see you again</h2>
          <h1>WELCOME BACK</h1>
          <h1>VAIDYAKIYA <span id="s-name">SAHAYAKA</span></h1>
        </div>
      </div>
      <div className="login-right">
        <h2>Login Account</h2>
        <p>VAIDYAKIYA SAHAYAKA</p>
        <form onSubmit={handleSubmit}>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Please Enter Email' required />

          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Please Enter Password' required />

          <p onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer', color: 'blue' }}>Forgot Password?</p>


          <button type="submit">Login</button>&nbsp;
          <button type="button" onClick={() => navigate('/')}>Back to Home</button>
        </form>
      </div>
    </div>
  );
}
