export default (sequelize, DataTypes) => sequelize.define('objectLocators', {
  locator: {
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
  },

  type: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notNull: true
    }
  }
});
