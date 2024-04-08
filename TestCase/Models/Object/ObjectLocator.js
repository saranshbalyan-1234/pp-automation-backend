export default (sequelize, DataTypes) => {
    const ObjectLocator = sequelize.define("objectLocators", {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        locator: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },

        objectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "objects",
                key: "id",
            },
            onDelete: "CASCADE",
        },
    });

    return ObjectLocator;
};
