export default (sequelize, DataTypes) => {
  const TestCase = sequelize.define('testCases', {
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
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'projects'
      },
      type: DataTypes.INTEGER
    },
    tags: {
      defaultValue: null,
      type: DataTypes.JSON
    }
  });

  return TestCase;
};
