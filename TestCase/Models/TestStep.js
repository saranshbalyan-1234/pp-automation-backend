export default (sequelize, DataTypes) => sequelize.define('testSteps', {
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
  enable: {
    defaultValue: 1,
    type: DataTypes.BOOLEAN,
    values: [0, 1]
  },
  objectId: {
    allowNull: true,
    references: {
      key: 'id',
      model: 'objects'
    },
    type: DataTypes.INTEGER
  },
  processId: {
    onDelete: 'CASCADE',
    references: {
      key: 'id',
      model: 'processes'
    },
    type: DataTypes.INTEGER
  },
  reusableProcessId: {
    onDelete: 'CASCADE',
    references: {
      key: 'id',
      model: 'reusableProcesses'
    },
    type: DataTypes.INTEGER
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
  xpath: {
    defaultValue: 0,
    type: DataTypes.BOOLEAN,
    values: [0, 1]
  }
});
