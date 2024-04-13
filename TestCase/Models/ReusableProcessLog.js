export default (sequelize, DataTypes) => sequelize.define('reusableProcessLogs', {
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
  reusableProcessId: {
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      key: 'id',
      model: 'reusableProcesses'
    },
    type: DataTypes.INTEGER,
    validate: {
      notNull: true
    }
  }
});
