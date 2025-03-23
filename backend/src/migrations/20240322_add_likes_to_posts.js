import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('Posts', 'likes', {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  });

  await queryInterface.addColumn('Posts', 'likedBy', {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
    allowNull: false
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('Posts', 'likes');
  await queryInterface.removeColumn('Posts', 'likedBy');
} 