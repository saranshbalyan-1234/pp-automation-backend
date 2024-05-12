
import { getTenantDB } from '#root/mongoConnection.js';

const defaultMiddleware = () => async (req, _res, next) => {
  try {
    const db = getTenantDB();
    req.models = db.models;
    req.tenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME;

    const session = await db.startSession();
    session.startTransaction();
    req.session = session;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default defaultMiddleware;
