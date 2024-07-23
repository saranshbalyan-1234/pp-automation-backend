import { getTenantDB } from '#root/mongoConnection.js';
// import { extractToken } from '#utils/jwt.js';

const defaultMiddleware = () => async (req, _res, next) => {
  try {
    // const token = extractToken(req);
    const allowRoutes = ['auth'];
    if (!allowRoutes.includes(req.url.split('/')[1])) return next();

    const db = await getTenantDB();
    req.models = db.models;
    req.tenant = process.env.DATABASE_NAME;
    req.database = process.env.DATABASE_PREFIX + req.tenant;

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
