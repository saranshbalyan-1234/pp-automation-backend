export default (sequelize, DataTypes) => {
  const Environment = sequelize.define('environments', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    testCaseId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'testCases'
      },
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    }
  });

  return Environment;
};
