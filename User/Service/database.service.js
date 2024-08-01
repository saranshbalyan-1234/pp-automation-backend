import errorContstants from '#constants/error.constant.js';
import { getTenantDB } from '#root/mongo.connection.js';
// import { deleteBucket } from '#storage/Service/awsService.js';
import cache from '#utils/cache.js';

const db = {};
const deleteCustomer = async (email) => {
  const tenantName = email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
  try {
    console.debug('Deleting Customer', email);
    const database = process.env.DATABASE_PREFIX + tenantName;

    await dropDatabase(database);
    /*
     * deleteBucket(database);
     * if (deletedCustomer > 0) return true;
     * throw new Error(errorContstants.RECORD_NOT_FOUND);
     */
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
  if (database === process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) throw new Error(errorContstants.UNABLE_TO_DELETE_MASTER_DATABASE);

  console.log(`deleting database ${database}`);
  try {
    const conn = await getTenantDB(database);
    return await conn.db.dropDatabase();
  } catch (err) {
    console.error(err);
    console.error(`Unable to delete ${database}: Not Found`);
    return false;
  }
};
export { deleteCustomer, dropDatabase, getAllTenant, getCachedKeys };
