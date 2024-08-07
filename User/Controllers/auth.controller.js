import pkg from 'jsonwebtoken';

import errorConstants from '#constants/error.constant.js';
import successConstants from '#constants/success.contant.js';
import { getTenantDB } from '#root/mongo.connection.js';
// import { createBucket } from '#storage/Service/awsService.js';
import getError from '#utils/error.js';
// import { createToken, getTokenError } from '#utils/jwt.js';
import { sendMail } from '#utils/Mail/nodeMailer.js';

import { loginWithCredentals } from '../Service/user.service.js';
const { verify } = pkg;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const tenant = req.headers['x-tenant-id'] || process.env.DATABASE_PREFIX + (process.env.MULTI_TENANT === 'false' ? process.env.DATABASE_NAME : email.replace(/[^a-zA-Z0-9 ]/g, ''));
    await req.models.unverified.create(
      [{ email, name, password, tenant }]
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
  try {
    const { email, password, rememberMe = false } = req.body;

    const loggedInUser = await loginWithCredentals({ email, models: req.models, password, rememberMe, tenant: req.headers['x-tenant-id'] });
    return res.status(200).json(loggedInUser);
  } catch (error) {
    getError(error, res);
  }
};

const verifyCustomer = async (req, res) => {
  try {
    const data = verify(req.params.token, process.env.JWT_VERIFICATION_SECRET);

    console.log('Verifying Customer', data.email);

    try {
      const unverifiedUser = await req.models.unverified.findOneAndDelete({ email: data.email }, { session: req.session });
      if (!unverifiedUser) throw new Error(errorConstants.RECORD_NOT_FOUND);

      const { email, password, name, tenant } = unverifiedUser;

      const customer = await req.models.customer.findOneAndUpdate({ email },
        { $push: { tenant }, email, password },
        { new: true, session: req.session, upsert: true }
      );

      /*
       * if (process.env.MULTI_TENANT !== 'false') {
       * createBucket(tenant.replace(process.env.DATABASE_PREFIX, ''))
       * }
       */
      const db = await getTenantDB(tenant);
      await db.models.user.create([{
        _id: customer._id,
        email,
        name,
        type: process.env.DATABASE_PREFIX + email.replace(/[^a-zA-Z0-9 ]/g, '') === tenant ? 'issuer' : 'user'
      }]);

      return res.status(200).json({ message: successConstants.EMAIL_VERIFICATION_SUCCESSFULL });
    } catch (error) {
      getError(error, res);
    }
  } catch (error) {
    getError(error, res, 'Email Verification');
  }
};

const resendVerificationMail = async (req, res) => {
  try {
    const { email } = req.body;
    const unverifiedUser = await req.models.unverified.findOne({ email });
    if (!unverifiedUser) throw new Error(errorConstants.RECORD_NOT_FOUND);
    const { name } = unverifiedUser;

    await sendMail({ email, name }, 'customerRegister');
    return res.status(200).json({ message: 'Mail Sent!' });
  } catch (error) {
    getError(error, res);
  }
};

// const resetPassword = async (req, res) => {

/*
 *   try {
 *     const data = verify(req.params.token, process.env.JWT_RESET_SECRET);
 */

/*
 *     if (data) {
 *       const { email, tenant } = data;
 */

//       const database = tenant;

/*
 *       const updatedUser = await User.schema(database).update(
 *         { password: req.body.password },
 *         {
 *           where: {
 *             email
 *           }
 *         }
 *       );
 *       if (updatedUser[0]) return res.status(200).json({ message: successConstants.PASSWORD_RESET_SUCCESSFULL });
 *       throw new Error(errorConstants.RECORD_NOT_FOUND);
 *     }
 *   } catch (error) {
 *     getError(error, res, 'Password Reset');
 *   }
 * };
 *
 *       // const refreshToken = (req, res) => {
 *
 *       /*
 *   try {
 *     const data = verify(req.params.token, process.env.JWT_REFRESH_SECRET);
 *     if (data) {
 *       const tokenData = { email: data.email, id: data.id };
 *       const accessToken = createToken(tokenData, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRATION);
 *       const refreshedToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION);
 *       return res.status(200).json({ accessToken, refreshToken: refreshedToken });
 *     }
 *   } catch (e) {
 *     return res.status(401).json({ error: getTokenError(e, 'Refresh') });
 *   }
 * };
 */

export { login, register, resendVerificationMail, verifyCustomer };
