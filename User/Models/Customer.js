import errorContstants from "#constants/error.js";
export default (sequelize, DataTypes) => {
    const Customer = sequelize.define(
        "customers",
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: "email",
                validate: {
                    isEmail: true,
                    notNull: true,
                },
            },
            blocked: {
                type: DataTypes.BOOLEAN,
                defaultValue: 0,
                values: [0, 1],
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: 0,
                values: [0, 1],
            },
            tenantName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: true,
                },
            },
        },
        {
            hooks: {
                afterFind: function (model) {
                    if (!Array.isArray(model)) {
                        if (model.dataValues.blocked) throw new Error(errorContstants.ACCOUNT_BLOCKED);
                    }
                },
            },
        }
    );

    return Customer;
};
