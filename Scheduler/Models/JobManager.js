import { createToken, decryptJwt } from "#utils/jwt.js";
export default (sequelize, DataTypes) => {
    const JobManager = sequelize.define("jobManagers", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1,
            values: [0, 1],
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            default: null,
        },
        connection: {
            type: DataTypes.TEXT,
            allowNull: true,
            set(value) {
                this.setDataValue("connection", createToken(value, process.env.JWT_ACCESS_SECRET));
            },
            get() {
                const token = this.getDataValue("connection");
                return token ? decryptJwt(token) : null;
            },
        },
        decryptionAllowed: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            values: [0, 1],
        },
        kmsData: {
            type: DataTypes.JSON,
            allowNull: true,
            set(value) {
                this.setDataValue("kmsData", createToken(value, process.env.JWT_ACCESS_SECRET));
            },
            get() {
                const token = this.getDataValue("kmsData");
                return token ? decryptJwt(token) : null;
            },
        },
    });

    return JobManager;
};
