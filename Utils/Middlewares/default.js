/*
 * Import { extractToken } from "../jwt.js";
 * import getError from "../sequelizeError.js";
 * import errorContstants from "#constants/error.js";
 * import pkg from "jsonwebtoken";
 */
import {getTenantDB} from '#utils/Mongo/mongoConnection.js'

const defaultMiddleware = () => (req, _res, next) => {
    req.models = getTenantDB().models;
  // req.user = {
  //   database: process.env.DATABASE_PREFIX+ process.env.DATABASE_NAME,
  //   tenant: 'master'
  // };

  // const db = mongoose.connection.useDb(`${process.env.DATABASE_PREFIX+req.user.tenant}`, {
  //   // `useCache` tells Mongoose to cache connections by database name, so
  //   // `mongoose.connection.useDb('foo', { useCache: true })` returns the
  //   // same reference each time.
  //   useCache: true
  // });

  next();
};

export default defaultMiddleware;
