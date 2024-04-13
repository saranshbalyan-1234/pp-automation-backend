/*
 * Import { extractToken } from "../jwt.js";
 * import getError from "../sequelizeError.js";
 * import errorContstants from "#constants/error.js";
 * import pkg from "jsonwebtoken";
 */

export const defaultMiddleware = () => async (req, res, next) => {
  req.user = {
    database: process.env.DATABASE_NAME,
    tenant: 'master'
  };
  next();
};
