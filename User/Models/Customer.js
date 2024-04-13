import errorContstants from '#constants/error.js';
export default (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'customers',
    {
      admin: {
        defaultValue: 0,
        type: DataTypes.BOOLEAN,
        values: [0, 1]
      },
      blocked: {
        defaultValue: 0,
        type: DataTypes.BOOLEAN,
        values: [0, 1]
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'email',
        validate: {
          isEmail: true,
          notNull: true
        }
      },
      tenantName: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: true
        }
      }
    },
    {
      hooks: {
        afterFind: function (model) {
          if (!Array.isArray(model)) {
            if (model.dataValues.blocked) throw new Error(errorContstants.ACCOUNT_BLOCKED);
          }
        }
      }
    }
  );

  return Customer;
};
