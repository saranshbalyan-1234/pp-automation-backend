export default (sequelize, DataTypes) => sequelize.define('testCaseLogs', {
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
  log: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notNull: true
    }
  },
  testCaseId: {
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      key: 'id',
      model: 'testCases'
    },
    type: DataTypes.INTEGER,
    validate: {
      notNull: true
    }
  }
});
