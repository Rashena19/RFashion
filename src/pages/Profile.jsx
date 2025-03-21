import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      try {
        const response = await axios.get(`http://localhost:3001/api/posts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Filter posts to only include those by the current user
        const userPosts = response.data.filter(post => post.authorId === user.id);
        setUserPosts(userPosts);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  if (!user) {
    return (
      <div className="container">
        <div className="error-message">Please log in to view your profile.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
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
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <h3>Posts</h3>
            <p>{userPosts.length}</p>
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