export default (sequelize, DataTypes) => {
  const Role = sequelize.define('roles', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'name',
      validate: {
        notNull: true
      }
    }
  });

  return Role;
};
