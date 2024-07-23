import pkg from 'jsonwebtoken';

import errorConstants from '#constants/error.constant.js';
import successConstants from '#constants/success.contant.js';
import { getTenantDB } from '#root/mongoConnection.js';
// import { createBucket } from '#storage/Service/awsService.js';
import getError from '#utils/error.js';
import { createToken, getTokenError } from '#utils/jwt.js';
import { sendMail } from '#utils/Mail/nodeMailer.js';

import { loginWithCredentals } from '../Service/user.service.js';
const { verify } = pkg;

const register = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */

  try {
    const { name, email, password } = req.body;
    const tenant = process.env.DATABASE_PREFIX + [process.env.MULTI_TENANT === 'false' ? process.env.DATABASE_NAME : email.replace(/[^a-zA-Z0-9 ]/g, '')];

    await req.models.customer.create(
      [{ email, password, tenant }],
      { session: req.session }
    );

    await req.models.unverified.create(
      [{ email, name, password, tenant }],
      { session: req.session }
    );

    await sendMail({ email, name }, 'customerRegister');

    return res.status(200).json({
      message: 'Registered successfuly, Please check email to verify account.'
    });
  } catch (error) {
    getError(error, res);
  }
};
const login = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */
  try {
    const { email, password, rememberMe = false } = req.body;

    const loggedInUser = await loginWithCredentals({ email, password, rememberMe,models: req.models,tenant:req.headers['x-tenant-id'] });
    return res.status(200).json(loggedInUser);
  } catch (error) {
    getError(error, res);
  }
};

const verifyCustomer = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */

  try {
    const data = verify(req.params.token, process.env.JWT_VERIFICATION_SECRET);
    const { email } = data;

    console.log('Verifying Customer', email);

    try {
      const unverifiedUser = await req.models.unverified.findOneAndDelete({ email }, { session: req.session }).lean();
      const customer = await req.models.unverified.findOne({ email }).lean();
      const tenant = customer.tenant[0];

      if (!unverifiedUser || !tenant || !tenant) throw new Error(errorConstants.RECORD_NOT_FOUND);

      const { name } = unverifiedUser;

      let db = req;
      if (process.env.MULTI_TENANT !== 'false') {
        // createBucket(tenant.replace(process.env.DATABASE_PREFIX, ''))
        db = await getTenantDB(tenant);
      };

      await db.models.user.create([{
        email,
        name,
        type: 'issuer',
        verifiedAt: Date.now()
      }]);

      return res.status(200).json({ message: successConstants.EMAIL_VERIFICATION_SUCCESSFULL });
    } catch (error) {
      getError(error, res);
    }
  } catch (error) {
    getError(error, res, 'Email Verification');
  }
};

const verifyUser = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */
  try {
    const data = verify(req.params.token, process.env.JWT_VERIFICATION_SECRET);
    if (data) {
      const { email, tenant } = data;

      const database = tenant;

      const user = await User.schema(database).findOne({
        where: { email }
      });

      if (user) {
        if (user.verifiedAt) throw new Error(errorConstants.EMAIL_ALREADY_VERIFIED);
        await User.schema(database).update(
          { active: true, verifiedAt: new Date() },
          {
            where: {
              email: data.email
            }
          }
        );
        return res.status(200).json({ message: successConstants.EMAIL_VERIFICATION_SUCCESSFULL });
      }
      throw new Error(errorConstants.RECORD_NOT_FOUND);
    }
  } catch (error) {
    getError(error, res, 'Email Verification');
  }
};

const resetPassword = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */
  try {
    const data = verify(req.params.token, process.env.JWT_RESET_SECRET);

    if (data) {
      const { email, tenant } = data;

      const database = tenant;

      const updatedUser = await User.schema(database).update(
        { password: req.body.password },
        {
          where: {
            email
          }
        }
      );
      if (updatedUser[0]) return res.status(200).json({ message: successConstants.PASSWORD_RESET_SUCCESSFULL });
      throw new Error(errorConstants.RECORD_NOT_FOUND);
    }
  } catch (error) {
    getError(error, res, 'Password Reset');
  }
};
const sendResetPasswordMail = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */
  try {
    const { email } = req.body;
    const customer = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).findOne({
      where: { email }
    });
    if (!customer) throw new Error(errorConstants.RECORD_NOT_FOUND);
    const database = process.env.DATABASE_PREFIX + customer.tenantName;

    const user = await User.schema(database).findOne({
      where: { email }
    });
    sendMail({ email, name: user.name, tenant: database }, 'reset-password');
    return res.status(200).json({ message: 'Password rest mail sent.' });
  } catch (error) {
    getError(error, res);
  }
};

const refreshToken = (req, res) => {
  /*  #swagger.tags = ["Auth"] */

  try {
    const data = verify(req.params.token, process.env.JWT_REFRESH_SECRET);
    if (data) {
      const tokenData = { email: data.email, id: data.id };
      const accessToken = createToken(tokenData, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRATION);
      const refreshedToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION);
      return res.status(200).json({ accessToken, refreshToken: refreshedToken });
    }
  } catch (e) {
    return res.status(401).json({ error: getTokenError(e, 'Refresh') });
  }
};

export { login, refreshToken, register, resetPassword, sendResetPasswordMail, verifyCustomer, verifyUser };
