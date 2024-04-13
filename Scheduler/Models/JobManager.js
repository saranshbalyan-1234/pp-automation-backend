import { createToken, decryptJwt } from '#utils/jwt.js';
export default (sequelize, DataTypes) => sequelize.define('jobManagers', {
  active: {
    defaultValue: 1,
    type: DataTypes.BOOLEAN,
    values: [0, 1]
  },
  connection: {
    allowNull: true,
    get () {
      const token = this.getDataValue('connection');
      return token ? decryptJwt(token) : null;
    },
    set (value) {
      this.setDataValue('connection', createToken(value, process.env.JWT_ACCESS_SECRET));
    },
    type: DataTypes.TEXT
  },
  decryptionAllowed: {
    defaultValue: 0,
    type: DataTypes.BOOLEAN,
    values: [0, 1]
  },
  kmsData: {
    allowNull: true,
    get () {
      const token = this.getDataValue('kmsData');
      return token ? decryptJwt(token) : null;
    },
    set (value) {
      this.setDataValue('kmsData', createToken(value, process.env.JWT_ACCESS_SECRET));
    },
    type: DataTypes.JSON
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notNull: true
    }
  },
  projectId: {
    allowNull: true,
    default: null,
    type: DataTypes.INTEGER
  }
});
