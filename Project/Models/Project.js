export default (sequelize, DataTypes) => {
  const Project = sequelize.define('projects', {
    createdByUser: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'users'
      },
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    endDate: {
      allowNull: true,
      type: DataTypes.DATEONLY
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    startDate: {
      allowNull: true,
      type: DataTypes.DATEONLY
    }
  });

  return Project;
};
