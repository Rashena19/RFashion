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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
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
          setIsLiked(user && response.data.likedBy?.includes(user.id));
          setError(null);
          // Fetch comments for this post
          try {
            const commentsResponse = await axios.get(`http://localhost:3001/api/comments/${id}`);
            setComments(commentsResponse.data);
          } catch (commentErr) {
            console.error('Error fetching comments:', commentErr);
            setComments([]);
          }
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
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      setError('Please log in to like posts');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to like posts');
        return;
      }

      console.log('Attempting to like post:', id);
      const response = await axios.post(
        `http://localhost:3001/api/posts/${id}/like`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Like response:', response.data);
      if (response.data) {
        setPost(prev => ({
          ...prev,
          likes: response.data.likes,
          likedBy: [...(prev.likedBy || []), user.id]
        }));
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Like error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to like post. Please try again.');
      }
    }
  };

  const handleUnlike = async () => {
    if (!user) {
      setError('Please log in to unlike posts');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to unlike posts');
        return;
      }

      console.log('Attempting to unlike post:', id);
      const response = await axios.post(
        `http://localhost:3001/api/posts/${id}/unlike`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Unlike response:', response.data);
      if (response.data) {
        setPost(prev => ({
          ...prev,
          likes: response.data.likes,
          likedBy: (prev.likedBy || []).filter(id => id !== user.id)
        }));
        setIsLiked(false);
      }
    } catch (err) {
      console.error('Unlike error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to unlike post. Please try again.');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setCommentError('Please log in to comment');
      return;
    }

    if (!newComment.trim()) {
      setCommentError('Please enter a comment');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCommentError('Please log in to comment');
        return;
      }

      const response = await axios.post(
        `http://localhost:3001/api/comments/${id}`,
        { content: newComment.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setComments(prev => [response.data, ...prev]);
        setNewComment('');
        setCommentError('');
      } else {
        setCommentError('Failed to post comment. Please try again.');
      }
    } catch (err) {
      console.error('Comment error:', err);
      setCommentError(err.response?.data?.message || 'Failed to post comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      setCommentError('Please log in to delete comments');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCommentError('Please log in to delete comments');
        return;
      }

      await axios.delete(
        `http://localhost:3001/api/comments/${commentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Delete comment error:', err);
      setCommentError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

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
          <div className="image-actions">
            {!isAuthor && (
              <button 
                onClick={isLiked ? handleUnlike : handleLike} 
                className={`like-button ${isLiked ? 'liked' : ''}`}
              >
                {isLiked ? '❤️' : '🤍'} {post.likes || 0}
              </button>
            )}
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
          
          {/* Comments Section */}
          <div className="comments-section">
            <h2>Comments ({comments.length})</h2>
            {user ? (
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  required
                />
                {commentError && <div className="error-message">{commentError}</div>}
                <button type="submit" className="submit-comment">
                  Post Comment
                </button>
              </form>
            ) : (
              <p className="login-prompt">Please <a href="/login">log in</a> to comment</p>
            )}

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author?.username}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                  {user && comment.userId === user.id && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="delete-comment"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </article>
    </div>
  );
}

export default BlogPost; 