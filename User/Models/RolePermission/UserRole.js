export default (sequelize, DataTypes) => {
    const UserRole = sequelize.define("userRoles", {
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
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "roles",
                key: "id",
            },
            onDelete: "CASCADE",
        },
    });

    return UserRole;
};
