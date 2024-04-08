export default (sequelize, DataTypes) => {
    const TestStep = sequelize.define("testSteps", {
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
        objectId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "objects",
                key: "id",
            },
        },
        screenshot: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            values: [0, 1],
        },
        xpath: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            values: [0, 1],
        },
        enable: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1,
            values: [0, 1],
        },
        processId: {
            type: DataTypes.INTEGER,
            references: {
                model: "processes",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        reusableProcessId: {
            type: DataTypes.INTEGER,
            references: {
                model: "reusableProcesses",
                key: "id",
            },
            onDelete: "CASCADE",
        },
    });

    return TestStep;
};
