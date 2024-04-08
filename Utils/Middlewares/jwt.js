import { extractToken } from "#utils/jwt.js";
import getError from "#utils/error.js";
import errorContstants from "#constants/error.js";
import pkg from "jsonwebtoken";
import cache from "#utils/cache.js";
const { verify } = pkg;
export const validateToken = () => {
    return async (req, res, next) => {
        try {
            const token = extractToken(req);
            if (!token) return res.status(401).json({ error: errorContstants.ACCESS_TOKEN_NOT_FOUND });
            const data = verify(token, process.env.JWT_ACCESS_SECRET);
            if (data) {
                const tokenCheck = handleCachedTokenCheck(data.email, data.tenant, token);
                if (!tokenCheck) return res.status(401).json({ error: errorContstants.NOT_AN_ACTIVE_SESSION });

                let temp = { ...data };
                delete temp.iat;
                delete temp.exp;
                req.user = temp;
                req.database = process.env.DATABASE_PREFIX + temp.tenant;
                next();
            }
        } catch (e) {
            getError(e, res, "Access");
        }
    };
};

const handleCachedTokenCheck = (email, tenant, token) => {
    if (process.env.JWT_ACCESS_CACHE) {
        if (cache.get(`accesstoken_${tenant}_${email}`) !== token) {
            return false;
        }
    }
    return true;
};
