export default (sequelize, DataTypes) => sequelize.define('environments', {
  name: {
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
