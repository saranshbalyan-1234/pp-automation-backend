export default (sequelize, DataTypes) =>
  sequelize.define('unverifieds', {
    email: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'email',
        model: 'customers'
      },
      type: DataTypes.STRING,
      unique: 'email',
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
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    token: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notNull: true
      }
    }
  });
