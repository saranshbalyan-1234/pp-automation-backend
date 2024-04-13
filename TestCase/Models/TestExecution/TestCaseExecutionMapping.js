export default (sequelize, DataTypes) => sequelize.define('testCaseExecutionMappings', {
  executionSuiteId: {
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      key: 'id',
      model: 'executionSuites'
    },
    type: DataTypes.INTEGER,
    validate: {
      notNull: true
    }
  },
  step: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      notNull: true
    }
  },
  testCaseId: {
    allowNull: false,
    references: {
      key: 'id',
      model: 'testCases'
    },
    type: DataTypes.INTEGER,
    validate: {
      notNull: true
    }
    // OnDelete: "CASCADE",
  }
});
