import pkg from 'jsonwebtoken';

import errorContstants from '#constants/error.constant.js';
import { getTenantDB } from '#root/mongoConnection.js';
import cache from '#utils/cache.js';
import getError from '#utils/error.js';

const { verify } = pkg;
export const validateToken = () => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: errorContstants.ACCESS_TOKEN_NOT_FOUND });
    const data = verify(token, process.env.JWT_ACCESS_SECRET);
    if (data) {
      const tokenCheck = handleCachedTokenCheck(data.email, token);
      if (!tokenCheck) return res.status(401).json({ error: errorContstants.NOT_AN_ACTIVE_SESSION });

      const temp = { ...data };
      delete temp.iat;
      delete temp.exp;
      req.user = temp;
      req.tenant = temp.tenant[0];

      if (temp.tenant.length > 1) {
        if (!req.headers['x-tenant-id']) return res.status(401).json({ error: errorContstants.TENANT_HEADER_REQUIRED });
        req.tenant = req.headers['x-tenant-id'];
      }

      //Check if user has access to this tenant
      if (!temp.tenant.includes(req.tenant)) return res.status(401).json({ error: errorContstants.UNAUTHORIZED_TENANT });

      const db = await getTenantDB(req.tenant);
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
