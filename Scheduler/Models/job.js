export default (sequelize, DataTypes) =>
  sequelize.define('jobs', {
    active: {
      defaultValue: 1,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    decryptColumn: {
      defaultValue: null,
      type: DataTypes.STRING
    },
    extension: {
      defaultValue: null,
      type: DataTypes.STRING,
      values: ['txt', 'csv', 'json', 'xlsx']
    },
    jobManagerId: {
      allowNull: false,
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
    query: {
      defaultValue: null,
      type: DataTypes.STRING
    },
    time: {
      defaultValue: '0 5 31 2 *',
      type: DataTypes.STRING
    },
    timezone: {
      defaultValue: 'Asia/Kolkata',
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    }
  });
