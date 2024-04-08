export default (sequelize, DataTypes) => {
    const ReusableProcessLogs = sequelize.define("reusableProcessLogs", {
        log: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        reusableProcessId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "reusableProcesses",
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

    return ReusableProcessLogs;
};
