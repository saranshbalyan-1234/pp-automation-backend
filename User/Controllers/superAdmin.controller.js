import _ from 'lodash';

import cache from '#utils/cache.js';
import getError from '#utils/error.js';

import { deleteCustomer, getCachedKeys } from '../Service/database.js';
import errorContstants from '#constants/error.constant.js';

const getAllTenant = async (req, res) => {
  try {
    const tenants = await req.models.customer.distinct('tenant');
    return res.status(200).json(tenants);
  } catch (error) {
    getError(error, res);
  }
};

const deleteCustomerByAdmin = async (req, res) => {
  try {
    const { customerEmail } = req.body;
    await deleteCustomer(customerEmail);
    return res.status(200).json({ message: 'Deleted all data!' });
  } catch (error) {
    getError(error, res);
  }
};

const getAllSession = (_req, res) => {
  try {
    const sessions = getCachedKeys();
    return res.status(200).json(sessions);
  } catch (error) {
    getError(error, res);
  }
};

const terminateSession = (req, res) => {
  try {
    const { email } = req.body;
    if (!process.env.JWT_ACCESS_CACHE) throw new Error(errorContstants.SESSION_OFF)
      if(!cache.get(`accesstoken_${email}`)) throw new Error(errorContstants.NOT_AN_ACTIVE_SESSION)
      cache.del(`accesstoken_${email}`);
    return res.status(200).json({ message: 'Session Terminated!' });
  } catch (error) {
    getError(error, res);
  }
};

export { deleteCustomerByAdmin, getAllSession, getAllTenant, terminateSession };
