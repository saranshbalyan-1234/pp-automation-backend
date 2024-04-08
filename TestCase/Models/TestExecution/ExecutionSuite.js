export default (sequelize, DataTypes) => {
    const ExecutionSuite = sequelize.define("executionSuites", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        projectId: {
            type: DataTypes.INTEGER,
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

    return ExecutionSuite;
};
