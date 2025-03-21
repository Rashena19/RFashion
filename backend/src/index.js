import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './config/database.js';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Fashion Blog API' });
});

// Initialize database and start server
const initializeApp = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database without force option
    await sequelize.sync();
    console.log('Database synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
};

initializeApp(); 