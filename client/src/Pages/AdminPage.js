  // src/components/AdminPage.js
  import React from 'react';
  import './../Css/AdminPage.css';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from './AuthContext';

  export default function AdminPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    const adminCards = [
      { title: "User List", description: "View all registered users", icon: "👥", action: () => navigate('/user-list') },
      { title: "Add Hospital", description: "Add new hospitals to the system", icon: "🏥", action: () => navigate('/add-hospital') },
      { title: "View Feedback", description: "Check feedback from users", icon: "📝", action: () => navigate('/admin/feedback') },
      { title: "Settings", description: "Configure admin settings", icon: "⚙️", action: () => navigate('/admin/settings') },
      { title: "Upcoming Feature", description: "Coming Soon...", icon: "🚧", action: () => alert("Coming soon...") }
    ];

    return (
      <div className="admin-page">
        <nav className="navbar">
          <div className="nav-left"><span className="logo">Vaidyakiya Sahayaka</span></div>
          <div className="nav-right">
            <span>{user?.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <div className="card-grid">
          {adminCards.map((card, index) => (
            <div className="card" key={index}>
              <div className="card-image">{card.icon}</div>
              <div className="card-body">
                <p>{card.description}</p>
                <button onClick={card.action}>{card.title}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
