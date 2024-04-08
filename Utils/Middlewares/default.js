// import { extractToken } from "../jwt.js";
// import getError from "../sequelizeError.js";
// import errorContstants from "#constants/error.js";
// import pkg from "jsonwebtoken";

export const defaultMiddleware = () => {
    return async (req, res, next) => {
        req.user = {
            tenant: "master",
            database: process.env.DATABASE_NAME,
        };
        next();
    };
};
