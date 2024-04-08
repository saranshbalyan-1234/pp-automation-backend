export default (sequelize, DataTypes) => {
    const TestStepHistory = sequelize.define("testStepHistories", {
        testStepId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        actionEvent: {
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
        object: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        testParameters: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        screenshot: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            values: [0, 1],
        },
        processId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
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
        failedLog: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });
    return TestStepHistory;
};
