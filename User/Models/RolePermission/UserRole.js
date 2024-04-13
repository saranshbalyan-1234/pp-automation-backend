export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define('userRoles', {
    roleId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'roles'
      },
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'users'
      },
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    }
  });

  return UserRole;
};
