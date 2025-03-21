import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

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
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

// Define relationships
Post.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

User.hasMany(Post, {
  foreignKey: 'authorId',
  as: 'posts',
});

export default Post; 