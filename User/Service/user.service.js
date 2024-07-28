import errorContstants from '#constants/error.constant.js';
import { getTenantDB } from '#root/mongo.connection.js';
import cache from '#utils/cache.js';
import { createToken } from '#utils/jwt.js';

const loginWithCredentals = async ({ email, password, rememberMe, isPassRequired = true, tenant }) => {
  try {
    let db = await getTenantDB();
    const customer = await db.models.customer.findOne({ email });
    if (!customer) { 
      const unverifiedUser = await req.models.unverified.findOne({ email });
      if (unverifiedUser)  throw new Error(errorContstants.EMAIL_NOT_VERIFIED);
      else throw new Error(errorContstants.RECORD_NOT_FOUND);
    } 

    let currentTenant = customer.tenant[0];

    const isAuthenticated = !isPassRequired || customer.password === password;
    if (!isAuthenticated) throw new Error(errorContstants.INCORRECT_PASSWORD);

    if (customer.tenant.length > 1) {
      if (tenant) {
        //Check if user has access to this tenant
        if (customer.tenant.includes(tenant)) currentTenant = tenant;
        else throw new Error(errorContstants.UNAUTHORIZED_TENANT);
      } else throw new Error(errorContstants.TENANT_HEADER_REQUIRED);
    }
    db = await getTenantDB(currentTenant);
    const user = await db.models.user.findOne({ email }).populate('roles');
    if ((!user && !customer.superAdmin) || !user) throw new Error(errorContstants.RECORD_NOT_FOUND);

    const { _id } = user;

    // Below code is to generate token only, no logic
    const tokenData = { _id, currentTenant, email, tenant: customer.tenant };

    const accessToken = createToken(
      { ...tokenData, roles: user.roles, superAdmin: customer.superAdmin },
      process.env.JWT_ACCESS_SECRET,
      rememberMe ? process.env.JWT_ACCESS_REMEMBER_EXPIRATION : process.env.JWT_ACCESS_EXPIRATION
    );
    const refreshToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, rememberMe ? process.env.JWT_REFRESH_REMEMBER_EXPIRATION : process.env.JWT_REFRESH_EXPIRATION);
    if (process.env.JWT_ACCESS_CACHE) cache.set(`accesstoken_${email}`, accessToken, process.env.JWT_ACCESS_CACHE);

    const combinedUserData = { ...customer, ...user, accessToken, currentTenant, refreshToken };
    delete combinedUserData.password;

    return combinedUserData;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export { loginWithCredentals };
