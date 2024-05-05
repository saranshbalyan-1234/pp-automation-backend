const seedSuperAdmin = async (conn) => {
  const email = 'superadmin@mail.com';
  const password = 'superadmin';
  const name = 'Super Admin';
  await conn.models.customer.findOneAndUpdate({ email }, { email, tenant: process.env.DATABASE_PREFIX + process.env.DATABASE_NAME }, { upsert: true });
  await conn.models.user.findOneAndUpdate({ email }, { email, name, password }, { upsert: true });
  return console.success('super admin seeded');
};

export default seedSuperAdmin;
