import bcrypt from "bcryptjs";
import errorContstants from "#constants/error.js";
export default (sequelize, DataTypes) => {
    const User = sequelize.define(
        "users",
        {
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
                unique: true,
                validate: {
                    isEmail: true,
                    notNull: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: true,
                },
                set(value) {
                    const hashedPass = bcrypt.hashSync(value, 8);
                    this.setDataValue("password", hashedPass);
                },
            },
            profileImage: {
                type: DataTypes.BOOLEAN,
                defaultValue: 0,
                values: [0, 1],
            },
            verifiedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1,
                values: [0, 1],
            },
            defaultProjectId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                default: null,
            },
        },
        {
            hooks: {
                afterFind: function (model) {
                    if (!Array.isArray(model)) {
                        if (!model.dataValues.active) throw new Error(errorContstants.ACCOUNT_INACTIVE);
                        // if(model.dataValues.verifiedAt) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);
                    }
                },
            },
        }
    );

    return User;
};
