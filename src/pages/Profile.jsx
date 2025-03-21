import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="error-message">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-icon">
            {user.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <h1 className="profile-title">Profile</h1>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>Username</label>
            <p>{user.username}</p>
          </div>
          
          <div className="info-group">
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div className="info-group">
            <label>Member Since</label>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <h3>Posts</h3>
            <p>0</p>
          </div>
          <div className="stat-item">
            <h3>Comments</h3>
            <p>0</p>
          </div>
          <div className="stat-item">
            <h3>Likes</h3>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 