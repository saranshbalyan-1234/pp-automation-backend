const seedSuperAdmin = async (conn) => {
await conn.models.customer.findOneAndUpdate({ 'email': "superadmin@mail.com" },{ 'email': 'superadmin@mail.com', tenant: process.env.DATABASE_PREFIX+process.env.DATABASE_NAME } , {upsert: true })
    await conn.models.user.findOneAndUpdate({ email: "superadmin@mail.com" }, { email: 'superadmin@mail.com', name: 'Super Admin', password: 'superAdmin' }, { upsert: true })
    return console.success("super admin seeded")
}

export default seedSuperAdmin;