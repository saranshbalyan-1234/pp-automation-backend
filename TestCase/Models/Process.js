export default (sequelize, DataTypes) => sequelize.define('processes', {
  comment: {
    allowNull: true,
    type: DataTypes.STRING
  },
  enable: {
    defaultValue: 1,
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
  reusableProcessId: {
    references: {
      key: 'id',
      model: 'reusableProcesses'
    },
    type: DataTypes.INTEGER
    // OnDelete: "CASCADE",
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
