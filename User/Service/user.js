import bcrypt from 'bcryptjs';

import errorContstants from '#constants/error.js';
import cache from '#utils/cache.js';
import db from '#utils/dataBaseConnection.js';
import { createToken } from '#utils/jwt.js';

// Main
const Customer = db.customers;

// Tenant
const User = db.users;
const Role = db.roles;
const Permission = db.permissions;
const UserRole = db.userRoles;

const loginWithCredentals = async ({ email, password, rememberMe, isPassRequired = true }) => {
  try {
    const customer = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).findOne({
      where: { email }
    });

    if (!customer) throw new Error(errorContstants.RECORD_NOT_FOUND);
    const tenant = process.env.DATABASE_PREFIX + customer.tenantName;

    const user = await User.schema(tenant).findOne({
      include: [
        {
          attributes: ['roleId'],
          include: [
            {
              attributes: ['name'],
              include: [
                {
                  attributes: ['name', 'view', 'add', 'edit', 'delete'],
                  model: Permission.schema(tenant)
                }
              ],
              model: Role.schema(tenant)
            }
          ],
          model: UserRole.schema(tenant)
        }
      ],
      where: { email }
    });

    if (!user) throw new Error(errorContstants.RECORD_NOT_FOUND);
    const isAuthenticated = !isPassRequired || (await bcrypt.compare(password, user.password));
    if (!isAuthenticated) throw new Error(errorContstants.INCORRECT_PASSWORD);

    const { id, verifiedAt } = user;
    if (!verifiedAt) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);

    let allPermissions = [];
    await user.userRoles.map((el) => {
      allPermissions = [...allPermissions, ...el.role.permissions];
      return { name: el.role.name, permissions: el.role.permissions };
    });

    const superAdmin = customer.admin === 2;
    const customerAdmin = customer.admin || superAdmin;

    const tokenData = { email, id, tenant: customer.tenantName };
    const accessToken = createToken(
      { ...tokenData, customerAdmin, permissions: allPermissions, superAdmin },
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
