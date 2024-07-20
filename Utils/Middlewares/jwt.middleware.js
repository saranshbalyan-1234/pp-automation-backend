import pkg from 'jsonwebtoken';

import errorContstants from '#constants/error.constant.js';
import { getTenantDB } from '#root/mongoConnection.js';
import cache from '#utils/cache.js';
import getError from '#utils/error.js';
import { extractToken } from '#utils/jwt.js';
const { verify } = pkg;
export const validateToken = () => async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: errorContstants.ACCESS_TOKEN_NOT_FOUND });
    const data = verify(token, process.env.JWT_ACCESS_SECRET);
    if (data) {
      const tokenCheck = handleCachedTokenCheck(data.email, token);
      if (!tokenCheck) return res.status(401).json({ error: errorContstants.NOT_AN_ACTIVE_SESSION });

      const temp = { ...data };
      delete temp.iat;
      delete temp.exp;
      req.user = temp;
      req.tenant = req.headers['x-tenant-id'];
      req.database = process.env.DATABASE_PREFIX + req.tenant;

      //Check whether header tenant is assigned to user or not
      if (!temp.tenant.includes(req.tenant)) return res.status(401).json({ error: errorContstants.UNAUTHORIZED_TENANT });

      const db = await getTenantDB(temp.tenant);
      req.models = db.models;

      const session = await db.startSession();
      session.startTransaction();
      req.session = session;

      next();
    }
  } catch (e) {
    getError(e, res, 'Access');
  }
};

const handleCachedTokenCheck = (email, token) => !(process.env.JWT_ACCESS_CACHE && cache.get(`accesstoken_${email}`) !== token);
