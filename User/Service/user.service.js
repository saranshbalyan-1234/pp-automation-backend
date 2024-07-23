import errorContstants from '#constants/error.constant.js';
import { getTenantDB } from '#root/mongoConnection.js';
import cache from '#utils/cache.js';
import { createToken } from '#utils/jwt.js';

const loginWithCredentals = async ({ email, password, rememberMe, isPassRequired = true, tenant = process.env.DATABASE_NAME}) => {
  try {
    const db = await getTenantDB();
    const customer = await db.models.customer.findOne({ email }).lean();
    if (!customer) throw new Error(errorContstants.RECORD_NOT_FOUND);

    if (process.env.MULTI_TENANT !== 'false') {
      if(tenant ==  process.env.DATABASE_NAME) throw new Error(errorContstants.UNAUTHORIZED_TENANT)
      db = await getTenantDB(tenant);
    };

    const user = await db.models.user.findOne({ email }).populate('roles').lean() || {};
    if (!user && !customer.superAdmin) throw new Error(errorContstants.RECORD_NOT_FOUND);

    const isAuthenticated = !isPassRequired || customer.password === password;
    if (!isAuthenticated) throw new Error(errorContstants.INCORRECT_PASSWORD);
    const { id, verifiedAt } = user;
    if (!verifiedAt && !customer.superAdmin) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);

    const tokenData = { email, id, tenant: user.tenant };
    const accessToken = createToken(
      { ...tokenData, roles: user.roles, superAdmin: customer.superAdmin },
      process.env.JWT_ACCESS_SECRET,
      rememberMe ? process.env.JWT_ACCESS_REMEMBER_EXPIRATION : process.env.JWT_ACCESS_EXPIRATION
    );
    const refreshToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, rememberMe ? process.env.JWT_REFRESH_REMEMBER_EXPIRATION : process.env.JWT_REFRESH_EXPIRATION);
    if (process.env.JWT_ACCESS_CACHE) cache.set(`accesstoken_${email}`, accessToken, process.env.JWT_ACCESS_CACHE);

    const combinedUserData = { ...customer, ...user, accessToken, refreshToken };
    delete combinedUserData.password;

    return combinedUserData;
  } catch (e) {
    throw new Error(e);
  }
};

export { loginWithCredentals };
