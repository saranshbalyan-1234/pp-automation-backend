import moment from 'moment';

import errorContstants from '#constants/error.js';
import { deleteBucket } from '#storage/Service/awsService.js';
import cache from '#utils/cache.js';
import db from '#utils/dataBaseConnection.js';
const deleteCustomer = async (email) => {
  const tenantName = email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
  try {
    console.debug('Deleting Customer', email);
    const Customer = db.customers;
    const Unverified = db.unverifieds;
    const User = db.users;
    const database = process.env.DATABASE_PREFIX + tenantName;

    const deletedCustomer = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
      where: { email }
    });
    await User.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
      where: { email }
    });

    Unverified.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
      where: { email }
    });

    await dropDatabase(database);
    deleteBucket(database);
    if (deletedCustomer > 0) return true;
    throw new Error(errorContstants.RECORD_NOT_FOUND);
  } catch (e) {
    throw new Error(e);
  }
};

const getAllTenant = async () => {
  try {
    // Customer
    const Customer = db.customers;

    return await Customer.findAll({
      attributes: ['tenantName', 'blocked'],
      group: ['tenantName']
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

const dropDatabase = async (database) => {
  if (process.env.MULTI_TENANT === 'false') return true;

  if (database === process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) throw new Error(errorContstants.UNABLE_TO_DELETE_MASTER_DATABASE);

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
export { deleteCustomer, dropDatabase, getAllTenant, getCachedKeys };
