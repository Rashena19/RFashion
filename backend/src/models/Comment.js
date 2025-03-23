import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
});

// Define relationships
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
});

export default Comment; 