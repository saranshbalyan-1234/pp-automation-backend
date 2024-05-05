const seedSuperAdmin = async (conn) => {
  const superAdmin = {
    email: 'superadmin@mail.com',
    name: 'Super Admin',
    password: 'superadmin',
    tenant: [{ name: process.env.DATABASE_PREFIX + process.env.DATABASE_NAME, type: 'superadmin' }]
  };
  await conn.models.user.findOneAndUpdate({ email: superAdmin.email },
    {
      email: superAdmin.email,
      name: superAdmin.name,
      password: superAdmin.password,
      roles: ['6637c119bb9e323d91e51816'],
      tenant: superAdmin.tenant
    },
    { upsert: true });
  return console.success('super admin seeded');
};

export default seedSuperAdmin;
