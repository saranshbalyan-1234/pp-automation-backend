export default (sequelize, DataTypes) => {
    const Unverified = sequelize.define("unverifieds", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,

            validate: {
                notNull: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "email",
            validate: {
                isEmail: true,
                notNull: true,
            },
            references: {
                model: "customers",
                key: "email",
            },
            onDelete: "CASCADE",
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
    });

    return Unverified;
};
