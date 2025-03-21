import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

export default router; 