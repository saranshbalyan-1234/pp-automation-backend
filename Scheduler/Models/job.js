export default (sequelize, DataTypes) => {
    const Job = sequelize.define("jobs", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        jobManagerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        time: {
            type: DataTypes.STRING,
            defaultValue: "0 5 31 2 *",
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        timezone: {
            type: DataTypes.STRING,
            defaultValue: "Asia/Kolkata",
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1,
            values: [0, 1],
        },
        query: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        decryptColumn: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        extension: {
            type: DataTypes.STRING,
            defaultValue: null,
            values: ["txt", "csv", "json", "xlsx"],
        },
    });

    return Job;
};
