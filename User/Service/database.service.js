import errorContstants from '#constants/error.constant.js';
import { getTenantDB, removeTenantDB } from '#root/mongo.connection.js';
// import { deleteBucket } from '#storage/Service/awsService.js';
import cache from '#utils/cache.js';

const db = {};
const deleteCustomer = async (email) => {
  const tenant = process.env.DATABASE_PREFIX + email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
  try {
    console.debug('Deleting Tenant', tenant);

    await dropDatabase(tenant);
    await removeTenantDB(tenant);
    /*
     * deleteBucket(database);
     * if (deletedCustomer > 0) return true;
     * throw new Error(errorContstants.RECORD_NOT_FOUND);
     */
  } catch (e) {
    console.error(e);
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
  if (database === process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) throw new Error(errorContstants.UNABLE_TO_DELETE_MASTER_DATABASE);
  try {
    const conn = await getTenantDB(database, false);
    const res = await conn.db.dropDatabase((err, result) => {
      console.debug(err, result);
    });
    if (res) console.debug('Deleted', database);
    else console.debug('Unable to delete', database);
    return true;
  } catch (err) {
    console.error(err);
    console.error(`Unable to delete ${database}: Not Found`);
    return false;
  }
};
export { deleteCustomer, dropDatabase, getAllTenant, getCachedKeys };
