export default (sequelize, DataTypes) => {
  const TestStepHistory = sequelize.define('testStepHistories', {
    actionEvent: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    comment: {
      allowNull: true,
      type: DataTypes.STRING
    },
    executionHistoryId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'executionHistories'
      },
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    failedLog: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    object: {
      allowNull: true,
      type: DataTypes.JSON
    },
    processId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    result: {
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    screenshot: {
      defaultValue: 0,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    step: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    testParameters: {
      allowNull: true,
      type: DataTypes.JSON
    },
    testStepId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    }
  });
  return TestStepHistory;
};
