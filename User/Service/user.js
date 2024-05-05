import errorContstants from '#constants/error.js';
import cache from '#utils/cache.js';
import { createToken } from '#utils/jwt.js';

// Main

// Tenant

const loginWithCredentals = async ({ req, email, password, rememberMe, isPassRequired = true }) => {
  try {
    const customer = await req.models.customer.findOne({ email: req.body.email });
    if (!customer) throw new Error(errorContstants.RECORD_NOT_FOUND);

    const user = await req.models.user.findOne({ email: req.body.email });
    if (!user) throw new Error(errorContstants.RECORD_NOT_FOUND);

    const isAuthenticated = !isPassRequired || user.password === password;
    if (!isAuthenticated) throw new Error(errorContstants.INCORRECT_PASSWORD);
    const { id, verifiedAt } = user;
    if (!verifiedAt) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);
    return;

    let allPermissions = [];
    await user.userRoles.map((el) => {
      allPermissions = [...allPermissions, ...el.role.permissions];
      return { name: el.role.name, permissions: el.role.permissions };
    });

    const tokenData = { email, id, tenant: customer.tenantName };
    const accessToken = createToken(
      { ...tokenData, permissions: allPermissions },
      process.env.JWT_ACCESS_SECRET,
      rememberMe ? process.env.JWT_ACCESS_REMEMBER_EXPIRATION : process.env.JWT_ACCESS_EXPIRATION
    );
    const refreshToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, rememberMe ? process.env.JWT_REFRESH_REMEMBER_EXPIRATION : process.env.JWT_REFRESH_EXPIRATION);
    if (process.env.JWT_ACCESS_CACHE) cache.set(`accesstoken_${customer.tenantName}_${email}`, accessToken, process.env.JWT_ACCESS_CACHE);

    return {
      accessToken,
      refreshToken
    };
  } catch (e) {
    throw new Error(e);
  }
};

export { loginWithCredentals };
