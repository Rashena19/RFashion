import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Comment from './Comment.js';

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
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likedBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  }
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

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',
});

Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post',
});

export default Post; 