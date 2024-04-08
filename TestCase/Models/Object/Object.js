export default (sequelize, DataTypes) => {
    const Object = sequelize.define("objects", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        description: {
            type: DataTypes.STRING,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "projects",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        tags: {
            type: DataTypes.JSON,
            defaultValue: null,
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

    return Object;
};
