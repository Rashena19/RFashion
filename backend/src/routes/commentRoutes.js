import express from 'express';
import {
  createComment,
  getComments,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a specific post
router.get('/:postId', getComments);

// Create a new comment (protected route)
router.post('/:postId', protect, createComment);

// Delete a comment (protected route)
router.delete('/:id', protect, deleteComment);

export default router; 