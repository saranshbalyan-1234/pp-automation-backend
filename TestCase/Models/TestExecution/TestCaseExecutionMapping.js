export default (sequelize, DataTypes) => {
    const TestCaseExecutionMapping = sequelize.define("testCaseExecutionMappings", {
        testCaseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "testCases",
                key: "id",
            },
            // onDelete: "CASCADE",
        },
        executionSuiteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
            references: {
                model: "executionSuites",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
    });

    return TestCaseExecutionMapping;
};
