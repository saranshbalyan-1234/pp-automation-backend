export default (sequelize, DataTypes) =>
  sequelize.define('roles', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'name',
      validate: {
        notNull: true
      }
    }
  });
