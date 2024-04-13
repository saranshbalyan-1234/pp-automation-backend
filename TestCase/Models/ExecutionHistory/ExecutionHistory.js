export default (sequelize, DataTypes) => {
  const ExecutionHistory = sequelize.define('executionHistories', {
    continueOnError: {
      defaultValue: 0,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    executedByUser: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    finishedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    headless: {
      defaultValue: 0,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    recordAllSteps: {
      defaultValue: 0,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    result: {
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    status: {
      defaultValue: 'EXECUTING',
      type: DataTypes.STRING,
      values: ['EXECUTING', 'COMPLETE', 'INCOMPLETE']
    },
    testCaseId: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'testCases'
      },
      onDelete: 'CASCADE',
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    totalSteps: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    }
  });

  return ExecutionHistory;
};
