import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../Css/HomePage.css';

const HomePage = () => {
  const [extraTextVisible, setExtraTextVisible] = useState(false);
  const navigate = useNavigate();

  const handleLoadMore = () => {
    setExtraTextVisible(true);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  }

  return (
    <div className="homepage-container">
      <div className="left-side">
        <h2>VAIDYAKIYA</h2>
      </div>

      <div className="right-side">
        <button className="btn" onClick={handleLoginClick}>Login</button>
        <button className="btn" onClick={handleRegisterClick}>Register</button>
      </div>

      <div className="center-content">
        <h1 className="typing-text">Vaidyakiya sahayaka</h1>
        <p>The application provides a user-friendly interface for both general users and administrators, ensuring real-time access to health-related facilities while reducing manual intervention. Lack awareness of medical schemes or facilities provided by the government.</p>

        {extraTextVisible && (
          <p className="extra-text">
            VAIDYAKIYA SAHAYAKA is a web-based application developed to assist an NGO in providing hospital support to the general public. The platform simplifies access to healthcare services by allowing users to search for hospitals based on specific diseases, register children for medical assistance, and view their medical history. It also includes features for collecting user feedback and plans to introduce more functionalities in the future. The application offers a user-friendly interface for both users and administrators, aiming to bridge the gap between underserved communities and quality healthcare while ensuring transparency, efficiency, and ease of use.
          </p>
        )}

        {!extraTextVisible && (
          <button className="btn load-more-btn" onClick={handleLoadMore}>
            About More
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
