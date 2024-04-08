import db from "#utils/dataBaseConnection.js";
import { createToken } from "#utils/jwt.js";
import { sendMail } from "#utils/Mail/nodeMailer.js";
import pkg from "jsonwebtoken";
import getError from "#utils/error.js";
import moment from "moment";
import { createBucket } from "#storage/Service/awsService.js";
import { dropDatabase, syncDatabase } from "../Service/database.js";
import { getTokenError } from "#utils/jwt.js";
import errorContstants from "#constants/error.js";
import { loginWithCredentals } from "../Service/user.js";
import successConstants from "#constants/success.js";
const { verify } = pkg;

//Main
const Customer = db.customers;
const Unverified = db.unverifieds;

//Tenant
const User = db.users;
// const Role = db.roles;
// const Permission = db.permissions;
// const UserRole = db.userRoles;

const register = async (req, res) => {
    /*  #swagger.tags = ["Auth"] */

    try {
        await db.sequelize.transaction(async (transaction) => {
            const { name, email, password } = req.body;

            let tenantName = process.env.MULTI_TENANT == "false" ? process.env.DATABASE_NAME : email.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
            await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME)
                .create({ email, tenantName, admin: true }, { transaction })
                .catch((e) => {
                    console.error(e);
                    throw new Error("Customer already exist");
                });
            const token = createToken({ email }, process.env.JWT_VERIFICATION_SECRET);
            await Unverified.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).create(
                {
                    name,
                    email,
                    password,
                    token,
                },
                { transaction }
            );
            sendMail({ email, name }, "customerRegister");

            if (process.env.NODE_ENV == "development") {
                return res.status(200).json({
                    message: "Registered successfuly, Please check email to verify account.",
                    verifyToken: token,
                });
            }

            return res.status(200).json({
                message: "Registered successfuly, Please check email to verify account.",
            });
        });
    } catch (error) {
        getError(error, res);
    }
};
const login = async (req, res) => {
    /*  #swagger.tags = ["Auth"] */
    try {
        const { email, password, rememberMe = false } = req.body;

        const loggedInUser = await loginWithCredentals({ email, password, rememberMe });
        return res.status(200).json(loggedInUser);
    } catch (error) {
        getError(error, res);
    }
};

const verifyCustomer = async (req, res) => {
    /*  #swagger.tags = ["Auth"] */

    try {
        const data = verify(req.body.token, process.env.JWT_VERIFICATION_SECRET);
        const { email } = data;

        console.log("Verifying Customer", email);

        const unverifiedUser = await Unverified.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).findOne({
            where: { email },
        });
        const customer = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).findOne({
            where: { email },
        });
        const { tenantName } = customer;
        const { name, password } = unverifiedUser;
        let database = process.env.DATABASE_PREFIX + tenantName;

        try {
            await db.sequelize.transaction(async (transaction) => {
                if (data) {
                    if (unverifiedUser) {
                        await Unverified.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
                            where: {
                                email,
                            },
                            transaction,
                        });

                        if (tenantName != process.env.DATABASE_NAME) {
                            console.log(`Creating database`, database);
                            await db.sequelize.query(`create DATABASE ${database}`).catch((err) => {
                                console.error(database);
                                console.log(err);
                                throw new Error(errorContstants.CUSTOMER_DATABASE_ALREADY_EXIST);
                            });
                            await syncDatabase(database);
                            createBucket(tenantName);
                        }

                        await User.schema(database).create({
                            name,
                            email,
                            password,
                            verifiedAt: moment(),
                        });

                        return res.status(200).json({ message: successConstants.EMAIL_VERIFICATION_SUCCESSFULL });
                    } else {
                        return res.status(500).json({ error: errorContstants.EMAIL_ALREADY_VERIFIED });
                    }
                }
            });
        } catch (error) {
            dropDatabase(database);
            getError(error, res);
        }
    } catch (error) {
        getError(error, res, "Email Verification");
    }
};

const verifyUser = async (req, res) => {
    /*  #swagger.tags = ["Auth"] */
    try {
        const data = verify(req.body.token, process.env.JWT_VERIFICATION_SECRET);
        if (data) {
            const { email, tenant } = data;

            let database = tenant;

            const user = await User.schema(database).findOne({
                where: { email },
            });

            if (user) {
                if (user.verifiedAt) throw new Error(errorContstants.EMAIL_ALREADY_VERIFIED);
                await User.schema(database).update(
                    { verifiedAt: new Date(), active: true },
                    {
                        where: {
                            email: data.email,
                        },
                    }
                );
                return res.status(200).json({ message: successConstants.EMAIL_VERIFICATION_SUCCESSFULL });
            } else {
                throw new Error(errorContstants.RECORD_NOT_FOUND);
            }
        }
    } catch (error) {
        getError(error, res, "Email Verification");
    }
};

const resetPassword = async (req, res) => {
    /*  #swagger.tags = ["Auth"] */
    try {
        const data = verify(req.body.token, process.env.JWT_RESET_SECRET);
        if (data) {
            const { email, tenant } = data;

            let database = tenant;

            const updatedUser = await User.schema(database).update(
                { password: req.body.password },
                {
                    where: {
                        email: email,
                    },
                }
            );
            if (updatedUser[0]) return res.status(200).json({ message: successConstants.PASSWORD_RESET_SUCCESSFULL });
            else throw new Error(errorContstants.RECORD_NOT_FOUND);
        }
    } catch (error) {
        getError(error, res, "Password Reset");
    }
};
const sendResetPasswordMail = async (req, res) => {
    /*  #swagger.tags = ["Auth"] */
    try {
        const { email } = req.body;
        const customer = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).findOne({
            where: { email },
        });
        if (!customer) throw new Error(errorContstants.RECORD_NOT_FOUND);
        let database = process.env.DATABASE_PREFIX + customer.tenantName;

        const user = await User.schema(database).findOne({
            where: { email },
        });
        sendMail({ email, name: user.name, tenant: database }, "reset-password");
        return res.status(200).json({ message: "Password rest mail sent." });
    } catch (error) {
        getError(error, res);
    }
};

const refreshToken = async (req, res) => {
    /*  #swagger.tags = ["Auth"] */
    const token = req.body.token;
    if (!token) return res.status(401).json({ error: errorContstants.REFRESH_TOKEN_NOT_FOUND });

    try {
        const data = verify(token, process.env.JWT_REFRESH_SECRET);
        if (data) {
            let tokenData = { id: data.id, email: data.email };
            const accessToken = createToken(tokenData, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRATION);
            const refreshToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION);
            return res.status(200).json({ accessToken, refreshToken });
        }
    } catch (e) {
        return res.status(401).json({ error: getTokenError(e, "Refresh") });
    }
};

export { login, register, verifyCustomer, verifyUser, resetPassword, sendResetPasswordMail, refreshToken };
