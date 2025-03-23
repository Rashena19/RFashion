import Post from '../models/Post.js';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';

export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;
    let image = null;

    // Handle image upload
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      image,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      authorId: req.user.id,
      published: true,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    console.log('Fetching all posts...');
    console.log('Request received:', {
      method: req.method,
      url: req.url,
      headers: req.headers
    });
    
    let posts = await Post.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log('Found posts:', posts.length);
    
    // If no posts exist, create a test post
    if (!posts || posts.length === 0) {
      console.log('No posts found, creating test post...');
      const testUser = await User.findOne();
      if (testUser) {
        const testPost = await Post.create({
          title: 'Welcome to R\'s Fashion Blog',
          content: 'This is a test post to verify the functionality of our blog system.',
          excerpt: 'Welcome to our fashion blog! This is a test post.',
          authorId: testUser.id,
          published: true
        });
        console.log('Test post created:', testPost);
        
        // Fetch posts again to include the new test post
        posts = await Post.findAll({
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }],
          order: [['createdAt', 'DESC']]
        });
      }
    }
    
    console.log('Final posts data:', JSON.stringify(posts, null, 2));
    res.json(posts);
  } catch (error) {
    console.error('Error in getPosts:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content, excerpt, tags } = req.body;
    let image = post.image;

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      if (post.image) {
        const oldImagePath = path.join(process.cwd(), 'public', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await post.update({
      title,
      content,
      excerpt,
      image,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : post.tags,
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete image file if it exists
    if (post.image) {
      const imagePath = path.join(process.cwd(), 'public', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const likedBy = post.likedBy || [];

    if (!likedBy.includes(userId)) {
      await post.update({
        likes: post.likes + 1,
        likedBy: [...likedBy, userId]
      });
    }

    res.json({ likes: post.likes });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const likedBy = post.likedBy || [];

    if (likedBy.includes(userId)) {
      await post.update({
        likes: Math.max(0, post.likes - 1),
        likedBy: likedBy.filter(id => id !== userId)
      });
    }

    res.json({ likes: post.likes });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 