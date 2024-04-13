export default (sequelize, DataTypes) => {
  const ObjectLogs = sequelize.define('objectLogs', {
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
    objectId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'objects'
      },
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    }
  });

  return ObjectLogs;
};
