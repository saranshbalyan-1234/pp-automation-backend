export default (sequelize, DataTypes) => {
    const TestCaseLogs = sequelize.define("testCaseLogs", {
        log: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
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

    return TestCaseLogs;
};
