import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  const calculateTotalLikes = (posts) => {
    try {
      return posts.reduce((sum, post) => {
        const postLikes = post.likedBy?.length || post.likes || 0;
        return sum + postLikes;
      }, 0);
    } catch (err) {
      console.error('Error calculating likes:', err);
      return 0;
    }
  };

  const fetchCommentsForPost = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/comments/${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(`Comments for post ${postId}:`, response.data);
      return response.data.length;
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
      return 0;
    }
  };

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
      console.log('User posts:', userPosts);
      setUserPosts(userPosts);

      // Calculate total likes from all user posts
      const likes = calculateTotalLikes(userPosts);
      setTotalLikes(likes);

      // Fetch comments for each post and calculate total
      const commentsPromises = userPosts.map(post => fetchCommentsForPost(post.id));
      const commentsCounts = await Promise.all(commentsPromises);
      console.log('Comments counts:', commentsCounts);
      const totalComments = commentsCounts.reduce((sum, count) => sum + count, 0);
      console.log('Total comments:', totalComments);
      setTotalComments(totalComments);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  // Set up an interval to refresh posts every 30 seconds to keep counts updated
  useEffect(() => {
    const interval = setInterval(fetchUserPosts, 30000);
    return () => clearInterval(interval);
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
            <p>{totalComments}</p>
          </div>
          <div className="stat-item">
            <h3>Likes</h3>
            <p>{totalLikes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 