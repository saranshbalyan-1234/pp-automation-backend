export default (sequelize, DataTypes) => {
  const Permission = sequelize.define('permissions', {
    add: {
      defaultValue: 0,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },

    delete: {
      defaultValue: 0,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    edit: {
      defaultValue: 0,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
      validate: {
        notNull: true
      }
    },
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
    view: {
      defaultValue: 0,
      type: DataTypes.BOOLEAN,
      values: [0, 1]
    }
  });

  return Permission;
};
