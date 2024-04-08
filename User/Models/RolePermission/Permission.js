export default (sequelize, DataTypes) => {
    const Permission = sequelize.define("permissions", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            validate: {
                notNull: true,
            },
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
        view: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            values: [0, 1],
        },
        add: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            values: [0, 1],
        },
        edit: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            values: [0, 1],
        },
        delete: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            values: [0, 1],
        },
    });

    return Permission;
};
