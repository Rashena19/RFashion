import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Starting to fetch posts...');
        console.log('Current user:', user);
        
        const response = await axios.get('http://localhost:3001/api/posts', {
          headers: {
            'Content-Type': 'application/json',
            ...(user?.token && { Authorization: `Bearer ${user.token}` })
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', response.data);
        
        if (Array.isArray(response.data)) {
          console.log('Setting posts:', response.data);
          setPosts(response.data);
        } else {
          console.error('Invalid data format received:', response.data);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        
        if (err.response?.status === 401) {
          setError('Please log in to view posts');
        } else if (err.response?.status === 404) {
          setError('No posts found');
        } else {
          setError(err.response?.data?.message || 'Failed to load posts');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Date formatting error:', err);
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
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2 className="error-message">{error}</h2>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry Loading Posts
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Latest Posts</h1>
        {user && (
          <Link to="/create" className="create-button">
            Create New Post
          </Link>
        )}
      </div>
      <div className="posts-grid">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-image">
                <img
                  src={getImageUrl(post.image) || `/photo${Math.floor(Math.random() * 3) + 1}.jpeg`}
                  alt={post.title}
                  onError={(e) => {
                    e.target.src = `/photo${Math.floor(Math.random() * 3) + 1}.jpeg`;
                  }}
                />
              </div>
              <div className="post-content">
                <h2>{post.title}</h2>
                <p className="excerpt">{post.excerpt}</p>
                <p className="post-meta">
                  By {post.author?.username || 'Unknown'} • {formatDate(post.createdAt)}
                </p>
                <Link to={`/post/${post.id}`} className="read-more">
                  Read More
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="no-posts">
            <p>No posts available. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 