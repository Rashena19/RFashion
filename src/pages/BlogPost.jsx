import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/BlogPost.css';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/posts/${id}`);
        
        if (response.data) {
          setPost(response.data);
          setError(null);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Post not found');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Network error - Please check if the server is running');
        } else {
          setError(err.response?.data?.message || 'Failed to load post');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!user) {
      setError('Please log in to delete posts');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/posts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/');
    } catch (err) {
      setError('Failed to delete post. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3001${imagePath}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container">
        <div className="error-container">
          <div className="error-message">{error || 'Post not found'}</div>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = user && post.authorId === user.id;

  return (
    <div className="container">
      <article className="post-detail">
        <div className="post-image">
          <img
            src={getImageUrl(post.image) || `/photo${Math.floor(Math.random() * 3) + 1}.jpeg`}
            alt={post.title}
            onError={(e) => {
              e.target.src = `/photo${Math.floor(Math.random() * 3) + 1}.jpeg`;
            }}
          />
          {isAuthor && (
            <div className="post-actions">
              <button 
                onClick={() => navigate(`/edit/${post.id}`)} 
                className="edit-button"
              >
                Edit Post
              </button>
              <button 
                onClick={handleDelete} 
                className="delete-button"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
        <div className="post-content">
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
          </div>
          <p className="post-meta">
            By {post.author?.username || 'Unknown'} • {formatDate(post.createdAt)}
          </p>
          <div className="post-body">
            {post.content}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              <div className="tags-container">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </article>
    </div>
  );
}

export default BlogPost; 