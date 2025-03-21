import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default Post; 