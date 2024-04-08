export default (sequelize, DataTypes) => {
    const Column = sequelize.define("columns", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        value: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        envId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "environments",
                key: "id",
            },
            onDelete: "CASCADE",
        },
    });

    return Column;
};
