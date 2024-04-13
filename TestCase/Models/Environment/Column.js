export default (sequelize, DataTypes) => {
  const Column = sequelize.define('columns', {
    envId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'environments'
      },
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
    value: {
      allowNull: true,
      type: DataTypes.STRING
    }
  });

  return Column;
};
