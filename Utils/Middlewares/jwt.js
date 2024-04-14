import pkg from 'jsonwebtoken';

import errorContstants from '#constants/error.js';
import cache from '#utils/cache.js';
import getError from '#utils/error.js';
import { extractToken } from '#utils/jwt.js';
const { verify } = pkg;
export const validateToken = () => (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: errorContstants.ACCESS_TOKEN_NOT_FOUND });
    const data = verify(token, process.env.JWT_ACCESS_SECRET);
    if (data) {
      const tokenCheck = handleCachedTokenCheck(data.email, data.tenant, token);
      if (!tokenCheck) return res.status(401).json({ error: errorContstants.NOT_AN_ACTIVE_SESSION });

      const temp = { ...data };
      delete temp.iat;
      delete temp.exp;
      req.user = temp;
      req.database = process.env.DATABASE_PREFIX + temp.tenant;
      next();
    }
  } catch (e) {
    getError(e, res, 'Access');
  }
};

const handleCachedTokenCheck = (email, tenant, token) => !(process.env.JWT_ACCESS_CACHE && cache.get(`accesstoken_${tenant}_${email}`) !== token);
