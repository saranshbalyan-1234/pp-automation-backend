import { getTenantDB } from '#root/mongo.connection.js';

const seedSuperAdmin = async () => {
  const conn = await getTenantDB();

  const superAdmin = {
    email: 'superadmin@mail.com',
    name: 'Super Admin',
    password: 'superadmin'
  };
  await conn.models.customer.findOneAndUpdate({ email: superAdmin.email },
    {
      email: superAdmin.email,
      password: superAdmin.password,
      superAdmin: true
    },
    { upsert: true });

  return console.success('super admin seeded');
};

export default seedSuperAdmin;
