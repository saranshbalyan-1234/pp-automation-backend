import bcrypt from 'bcryptjs';

import errorContstants from '#constants/error.constant.js';
export default (sequelize, DataTypes) =>
  sequelize.define(
    'users',
    {
      active: {
        defaultValue: 1,
        type: DataTypes.BOOLEAN,
        values: [0, 1]
      },
      defaultProjectId: {
        allowNull: true,
        default: null,
        type: DataTypes.INTEGER
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
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
      password: {
        allowNull: false,
        set (value) {
          const hashedPass = bcrypt.hashSync(value, 8);
          this.setDataValue('password', hashedPass);
        },
        type: DataTypes.STRING,
        validate: {
          notNull: true
        }
      },
      profileImage: {
        defaultValue: 0,
        type: DataTypes.BOOLEAN,
        values: [0, 1]
      },
      verifiedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      hooks: {
        afterFind: function afterFind (model) {
          if (!Array.isArray(model) && !model.dataValues.active) throw new Error(errorContstants.ACCOUNT_INACTIVE);
          // If(model.dataValues.verifiedAt) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);
        }
      }
    }
  );
