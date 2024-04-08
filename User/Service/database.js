import { deleteBucket } from "#storage/Service/awsService.js";
import errorContstants from "#constants/error.js";
import db from "#utils/dataBaseConnection.js";
import cache from "#utils/cache.js";
import moment from "moment";
const deleteCustomer = async (email) => {
    const tenantName = email.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
    try {
        console.debug("Deleting Customer", email);
        const Customer = db.customers;
        const Unverified = db.unverifieds;
        const User = db.users;
        const database = process.env.DATABASE_PREFIX + tenantName;

        const deletedCustomer = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
            where: { email },
        });
        await User.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
            where: { email },
        });

        Unverified.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
            where: { email },
        });

        await dropDatabase(database);
        deleteBucket(database);
        if (deletedCustomer > 0) return true;
        throw new Error(errorContstants.RECORD_NOT_FOUND);
    } catch (e) {
        throw new Error(e);
    }
};

const syncDatabase = async (database, force = false, alter = false) => {
    try {
        console.log("Please wait, while models are being synced");
        const models = Object.values(db.sequelize.models);
        let synced = [];
        for (var i = 0; i < models.length; i++) {
            const model = models[i];
            if (model.name == "customers" || model.name == "unverifieds") continue;
            console.debug(`synced ${model.name} in ${database}`);
            synced.push(model.name);
            await model.schema(database).sync({ force, alter });
        }
        console.success(`MODEL SYNC COMPLETED`);
        return synced;
    } catch (e) {
        throw new Error(e);
    }
};

const getAllTenant = async () => {
    try {
        //Customer
        const Customer = db.customers;

        return await Customer.findAll({
            attributes: ["tenantName", "blocked"],
            group: ["tenantName"],
        });
    } catch (err) {
        throw new Error(err);
    }
};

const getCachedKeys = () => {
    try {
        return cache.keys();
    } catch (e) {
        throw new Error(e);
    }
};

const createSuperAdmin = async () => {
    const email = "superadmin@mail.com";
    const password = "superadmin";
    const name = "Super Admin";
    try {
        const Customer = db.customers;
        const User = db.users;
        await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).create({
            email,
            tenantName: process.env.DATABASE_NAME,
            admin: 2,
        });
        await User.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).create({
            name,
            email,
            password,
            verifiedAt: moment(),
        });
        console.success("Super admin Created successfully");
    } catch (e) {
        console.error("SuperAdmin Already Exist", e);
    }
};

const dropDatabase = async (database) => {
    if (process.env.MULTI_TENANT == "false") return true;

    if (database == process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) throw new Error(errorContstants.UNABLE_TO_DELETE_MASTER_DATABASE);

    console.log(`deleting database ${database}`);
    try {
        await db.sequelize.query(`drop database ${database}`);
        return true;
    } catch (err) {
        console.error(err);
        console.error(`Unable to delete ${database}: Not Found`);
        return false;
    }
};
export { deleteCustomer, syncDatabase, getAllTenant, getCachedKeys, createSuperAdmin, dropDatabase };
