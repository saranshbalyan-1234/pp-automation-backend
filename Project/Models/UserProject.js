export default (sequelize, DataTypes) => {
  const UserProject = sequelize.define('userProjects', {
    projectId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'projects'
      },
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'users'
      },
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    }
  });

  return UserProject;
};
