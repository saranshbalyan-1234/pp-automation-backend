export default (sequelize, DataTypes) => {
    const ProcessHistory = sequelize.define("processHistories", {
        processId: {
            type: DataTypes.INTEGER,
            // unique: true,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        reusableProcess: {
            type: DataTypes.JSON,
            defaultValue: null,
        },
        executionHistoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "executionHistories",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        result: {
            type: DataTypes.BOOLEAN,
            values: [0, 1],
        },
    });

    return ProcessHistory;
};
