import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/CreatePost.css';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    image: null
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with ID:', id);
        const response = await axios.get(`http://localhost:3001/api/posts/${id}`);
        const post = response.data;
        
        console.log('Fetched post data:', post);
        
        if (!post) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        // Check if user is the author
        if (post.authorId !== user.id) {
          setError('You are not authorized to edit this post');
          setLoading(false);
          return;
        }
        
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          tags: post.tags ? post.tags.join(', ') : '',
          image: null
        });

        // Set image preview if post has an image
        if (post.image) {
          setImagePreview(post.image);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Failed to load post. Please try again.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Submitting updated post data:', formData);
      
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('content', formData.content);
      postData.append('excerpt', formData.excerpt);
      postData.append('tags', formData.tags);
      if (formData.image) {
        postData.append('image', formData.image);
      }

      console.log('Processed post data:', postData);

      const response = await axios.put(`http://localhost:3001/api/posts/${id}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Update response:', response.data);
      navigate(`/post/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate(`/post/${id}`)} className="back-button">
          Back to Post
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="create-post">
        <h1>Edit Post</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., fashion, style, trends"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Update Post
            </button>
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost; 