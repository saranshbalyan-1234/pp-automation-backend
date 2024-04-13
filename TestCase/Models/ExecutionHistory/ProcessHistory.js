export default (sequelize, DataTypes) => sequelize.define('processHistories', {
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
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notNull: true
    }
  },
  processId: {
    // Unique: true,
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
  reusableProcess: {
    defaultValue: null,
    type: DataTypes.JSON
  },
  step: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      notNull: true
    }
  }
});
