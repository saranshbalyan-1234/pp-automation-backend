export default (sequelize, DataTypes) => sequelize.define('testParameters', {
  method: {
    allowNull: false,
    defaultValue: 'Static',
    type: DataTypes.STRING,
    validate: {
      notNull: true
    }
  },
  property: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notNull: true
    }
  },
  testStepId: {
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      key: 'id',
      model: 'testSteps'
    },
    type: DataTypes.INTEGER,
    validate: {
      notNull: true
    }
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notNull: true
    }
  }
});
