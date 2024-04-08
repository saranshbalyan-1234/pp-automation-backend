export default (sequelize, DataTypes) => {
    const ObjectLogs = sequelize.define("objectLogs", {
        log: {
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
        createdByUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "users",
                key: "id",
            },
        },
    });

    return ObjectLogs;
};
