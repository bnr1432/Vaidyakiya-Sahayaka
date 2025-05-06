import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../Css/UserList.css'; // Optional: Separate CSS
import { useNavigate } from 'react-router-dom';


const UserList = ({ onClose }) => {
    const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Registered Users</h2>
        <button className="close-btn" onClick={() => navigate('/admin-page')}>Close</button>
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.firstName} {user.lastName}</h3>
            <p>Email: {user.email}</p>
            <p>Mobile: {user.mobile}</p>
            <p>Age: {user.age}</p>
            <p>Address: {user.address}</p>
            <p>Gender: {user.gender}</p>
            <p>Blood Group: {user.bloodGroup}</p>
            {user.children?.length > 0 && (
              <div>
                <h4>Children:</h4>
                <ul>
                  {user.children.map((child) => (
                    <li key={child.id}>
                      {child.firstName} {child.lastName} - {child.age} years
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
