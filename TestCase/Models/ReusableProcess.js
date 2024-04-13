export default (sequelize, DataTypes) => {
  const ReusableProcess = sequelize.define('reusableProcesses', {
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
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
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
    tags: {
      defaultValue: null,
      type: DataTypes.JSON
    }
  });

  return ReusableProcess;
};
