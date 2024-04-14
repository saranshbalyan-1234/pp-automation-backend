/*
 * Import { extractToken } from "../jwt.js";
 * import getError from "../sequelizeError.js";
 * import errorContstants from "#constants/error.js";
 * import pkg from "jsonwebtoken";
 */

const defaultMiddleware = () => (req, _res, next) => {
  req.user = {
    database: process.env.DATABASE_NAME,
    tenant: 'master'
  };
  next();
};

export default defaultMiddleware;
