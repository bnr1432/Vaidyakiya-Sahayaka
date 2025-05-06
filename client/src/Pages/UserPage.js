import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../Css/UserPage.css';
import { useAuth } from './AuthContext';

export default function UserPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cards = [
    {
      title: "Search Hospital",
      description: "Click here to search hospitals based on your diseases",
      icon: "🏥",
      path: "/search-hospital"
    },
    {
      title: "Register For Child",
      description: "Click here to register for your children on their disease",
      icon: "👶",
      path: "/register-child"
    },
    {
      title: "Search History",
      description: "Click here to view all your Hospital history and account details",
      icon: "📜",
      path: "/search-history"
    },
    {
      title: "Feedback",
      description: "Click here to give feedback",
      icon: "🗣️",
      path: "/feedback"
    },
    {
      title: "UpComing Feature",
      description: "Coming Soon...",
      icon: "🚧",
      path: null
    }
  ];

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

      <div className="card-grid">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <div className="card-image">{card.icon}</div>
            <div className="card-body">
              <p>{card.description}</p>
              <button
                onClick={() => {
                  if (card.path) {
                    navigate(card.path);
                  } else {
                    alert('This feature is coming soon!');
                  }
                }}
              >
                {card.title}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
