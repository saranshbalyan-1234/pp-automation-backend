export default (sequelize, DataTypes) => {
    const UserProject = sequelize.define("userProjects", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "users",
                key: "id",
            },
            onDelete: "CASCADE",
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
    });

    return UserProject;
};
