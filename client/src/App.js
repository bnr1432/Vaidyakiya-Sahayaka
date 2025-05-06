import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminPage from './Pages/AdminPage';
import UserPage from './Pages/UserPage';
import SearchHospital from './Pages/SearchHospital';
import { AuthProvider } from './Pages/AuthContext';
import ProtectedRoute from './Pages/ProtectedRoute';
import RegisterChild from './Pages/RegisterChild';
import Feedback from './Pages/Feedback';  
import FeedbackList from './Pages/FeedbackList';   
import AddHosiptal from './Pages/AddHospital';
import UserList from './Pages/UserList';
import SearchHistory from './Pages/SearchHistory';
import ForgotPassword from './Pages/ForgotPassword';
import AdminSettings from './Pages/AdminSettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/admin-page" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />

          <Route path="/user-page" element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          } />

          <Route path="/search-hospital" element={
            <ProtectedRoute>
              <SearchHospital />
            </ProtectedRoute>
          } />

          <Route path="/register-child" element={
            <ProtectedRoute>
              <RegisterChild />
            </ProtectedRoute>
          } />

          <Route path="/add-hospital" element={
            <ProtectedRoute>
              <AddHosiptal/>
            </ProtectedRoute>
          } />


          <Route path="/user-list" element={
            <ProtectedRoute>
              <UserList/>
            </ProtectedRoute>
          } />

           <Route path="/search-history" element={
            <ProtectedRoute>
              <SearchHistory/>
            </ProtectedRoute>
          } />

          <Route path="/forgot-password" element={
            <ForgotPassword />
          }/>

         <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />


          {/* Feedback routes */}
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminSettings/>
            </ProtectedRoute>
          } />

          {/* Admin Feedback List */}
          <Route path="/admin/feedback" element={
            <ProtectedRoute>
              <FeedbackList />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
