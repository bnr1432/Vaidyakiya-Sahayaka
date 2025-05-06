import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './../Css/AdminSettings.css';

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/admin/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleDelete = (userId) => {
    axios.delete(`http://localhost:5000/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setUsers(prev => prev.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error("Error deleting user:", error);
      });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    const { id, firstName, lastName, email, mobile, age } = editingUser;

    axios.put(`http://localhost:5000/admin/users/${id}`, {
      firstName,
      lastName,
      email,
      mobile,
      age,
      address: editingUser.address || '',
      gender: editingUser.gender || '',
      bloodGroup: editingUser.bloodGroup || ''
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setUsers(users.map(user => user.id === id ? editingUser : user));
        setEditingUser(null);
      })
      .catch(error => {
        console.error("Error updating user:", error);
      });
  };

  return (
        <div className="user-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">Vaidyakiya sahayaka</span>
        </div>
        <div className="nav-right">
          <span>{user?.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="admin-settings">

      <div className="user-list">
        <h2>User List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.age}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
                {user.children && user.children.length > 0 && (
                  <tr>
                    <td colSpan="5">
                      <strong>Children:</strong>
                      <ul>
                        {user.children.map(child => (
                          <li key={child.id}>
                            {child.firstName} {child.lastName}, Age: {child.age}, Blood Group: {child.bloodGroup}, Gender: {child.gender}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="edit-user">
          <h3>Edit User</h3>
          <form onSubmit={handleUpdateUser}>
            <label>
              First Name:
              <input
                type="text"
                value={editingUser.firstName || ''}
                onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={editingUser.lastName || ''}
                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </label>
            <label>
              Mobile:
              <input
                type="text"
                value={editingUser.mobile || ''}
                onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })}
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                value={editingUser.age || ''}
                onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
              />
            </label>
            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </div>
    </div>
 
  );
}
