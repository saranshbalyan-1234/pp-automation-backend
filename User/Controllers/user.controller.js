// import successConstants from '#constants/success.contant.js';
import mongoose from 'mongoose';

import { getTenantDB } from '#root/mongo.connection.js';
/*
 * import { s3, uploadFile } from '#storage/Service/awsService.js';
 * import cache from '#utils/cache.js';
 */
import getError from '#utils/error.js';
// import { deleteCustomer } from '../Service/database.js';

const getOrUpdateUser = async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.status;
    delete body.type;

    const { assword } = body;
    req.body._id ||= new mongoose.Types.ObjectId();
    if (password) {
      const db = await getTenantDB();
      await db.models.customer.findOneAndUpdate(
        { _id: req.body._id },
        { password }
      );
    }

    const user = await req.models.user.findOneAndUpdate(
      { _id: req.body._id },
      { ...req.body },
      { new: true });

    return res.status(200).json(user);
  } catch (error) {
    getError(error, res);
  }
};

// const getTeam = async (req, res) => {

/*
 *   try {
 *     const team = await User.schema(req.database).findAll({
 *       attributes: ['id', 'name', 'email', 'profileImage', 'verifiedAt', 'deletedAt', 'active', 'defaultProjectId']
 *     });
 *     const filteredTeam = team.filter((el) => el.id !== req.user.id);
 */

/*
 *     const teamWithImages = await filteredTeam.map(async (user) => {
 *       let base64ProfileImage = '';
 *       if (user.dataValues.profileImage) {
 *         try {
 *           const getParams = {
 *             Bucket: req.database.split('_')[1].toLowerCase(),
 *             Key: user.email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
 *           };
 */

//           const data = await s3.getObject(getParams);

/*
 *           if (data?.Body) {
 *             base64ProfileImage = await data.Body.transformToString('base64');
 *           } else {
 *             base64ProfileImage = data;
 *           }
 *           return {
 *             ...user.dataValues,
 *             profileImage: user.dataValues.profileImage ? base64ProfileImage : ''
 *           };
 *         } catch (err) {
 *           console.error('Profile Image Error', err);
 *           return {
 *             ...user.dataValues,
 *             profileImage: ''
 *           };
 *         }
 *       } else {
 *         return {
 *           ...user.dataValues,
 *           profileImage: base64ProfileImage
 *         };
 *       }
 *     });
 *     Promise.all(teamWithImages)
 *       .then((data) => res.status(200).json(data))
 *       .catch((err) => {
 *         throw new Error(err);
 *       });
 *   } catch (error) {
 *     getError(error, res);
 *   }
 * };
 */

// const deleteUser = async (req, res) => {

/*
 *   try {
 *     const { userId } = req.params;
 */

/*
 *     const user = await User.schema(req.database).findByPk(userId);
 *     if (req.user.tenant === user.email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()) throw new Error('Cannot Delete Customer Admin');
 *     await userProject.schema(req.database).destroy({ where: { userId } });
 *     await UserRole.schema(req.database).destroy({ where: { userId } });
 *     const deletedUser = await User.schema(req.database).destroy({
 *       where: {
 *         id: userId
 *       }
 *     });
 *     if (deletedUser > 0) {
 *       const deletedCustomerUser = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
 *         where: {
 *           email: user.email
 *         }
 *       });
 *       if (deletedCustomerUser > 0) {
 *         return res.status(200).json({ message: 'User Deleted Successfully' });
 *       }
 *     } else {
 *       throw new Error('User Not Found');
 *     }
 *   } catch (error) {
 *     getError(error, res);
 *   }
 * };
 */

// const deleteCustomerUser = async (req, res) => {

/*
 *   try {
 *     if (!req.user.customerAdmin) return res.status(401).json({ message: 'Only customer admin can perform this operation!' });
 */

/*
 *     await deleteCustomer(req.user.email);
 *     return res.status(200).json({ message: 'Deleted all data!' });
 *   } catch (error) {
 *     getError(error, res);
 *   }
 * };
 */

// const uploadProfileImage = async (req, res) => {

/*
 *   try {
 *     const file = req.files.image;
 *     if (!file) throw new Error('Inavlid Image');
 *     const bucketName = req.database.split('_')[1].toLowerCase();
 *     const fileName = req.user.email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
 *     const result = await uploadFile(file, bucketName, fileName);
 *     if (result) {
 *       await User.schema(req.database).update(
 *         { profileImage: true },
 *         {
 *           where: {
 *             id: req.user.id
 *           }
 *         }
 *       );
 *       return res.status(200).json({ message: successConstants.UPDATED });
 *     }
 *     throw new Error('Unable to upload profile image!');
 *   } catch (error) {
 *     getError(error, res);
 *   }
 * };
 */

// const logout = (req, res) => {

/*
 *   try {
 *     if (process.env.JWT_ACCESS_CACHE) cache.del(`accesstoken_${req.user.email}`);
 *     return res.status(200).json({ message: 'Logout Successfull' });
 *   } catch (error) {
 *     getError(error, res);
 *   }
 * };
 */

export { getOrUpdateUser };
