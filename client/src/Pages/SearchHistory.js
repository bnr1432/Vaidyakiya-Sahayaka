import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';


export default function SearchHistory() {
    const navigate = useNavigate();
    
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/search-history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data.history);
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="search-history-page">
         <button className="back-button" onClick={() => navigate('/user-page')}>
          ← Back
        </button>
      <h2>{user?.email}'s Search History</h2>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>
              <h3>Name: {item.name}</h3>
              <p>Disease: {item.disease}</p>
              <p>Date: {new Date(item.timestamp).toLocaleString()}</p>
              <p>Hospitals: {item.hospitals.join(', ')}</p> 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
