import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../Css/SearchHospital.css';
import { useAuth } from './AuthContext';
import axios from 'axios';


export default function SearchHospital() { 
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [results, setResults] = useState([]);

  const diseases = [
    'Fever', 'Cold', 'Diabetes', 'Hypertension', 'Asthma',
    'Malaria', 'Heart Disease', 'Cancer', 'Allergy', 'Covid-19'
  ];

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/names', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNames(res.data.names);
      } catch (err) {
        console.error('Failed to fetch names', err);
      }
    };

    fetchNames();
  }, []);

  const handleSearch = async () => {
    if (!selectedName || !selectedDisease) {
      alert('Please select both name and disease.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
  
      // This endpoint both searches and saves the search
      const res = await axios.post(
        'http://localhost:5000/search-hospitals',
        { name: selectedName, disease: selectedDisease },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data.hospitals);
      
    } catch (err) {
      console.error('Search failed', err);
    }
  };
  

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="search-hospital-page">
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

      <div className="search-container">
        <button className="back-button" onClick={() => navigate('/user-page')}>
          ← Back
        </button>
        <h2>Search for a Hospital</h2>

        <div className="search-form">
          <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
            <option value="">Select Name</option>
            {names.map((name, idx) => (
              <option key={idx} value={name}>{name}</option>
            ))}
          </select>

          <select value={selectedDisease} onChange={(e) => setSelectedDisease(e.target.value)}>
            <option value="">Select Disease</option>
            {diseases.map((disease, idx) => (
              <option key={idx} value={disease}>{disease}</option>
            ))}
          </select>

          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="results">
          {results.length > 0 ? (
            <ul>
              {results.map((hospital, index) => (
                <li key={index}>
                  <h3>{hospital.name}</h3>
                  <p>{hospital.description}</p>
                  <a href={hospital.direction} target="_blank" rel="noopener noreferrer">
                    <button className="get-direction-btn">📍 Get Directions</button>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hospitals found for the selected disease.</p>
          )}
        </div>
      </div>
    </div>
  );
}
