import successConstants from '#constants/success.contant.js';
import { getTenantDB } from '#root/mongoConnection.js';
import { s3, uploadFile } from '#storage/Service/awsService.js';
import cache from '#utils/cache.js';
import getError from '#utils/error.js';
import { sendMail } from '#utils/Mail/nodeMailer.js';

import { deleteCustomer } from '../Service/database.js';
const db = {};
const User = db.users;
const Customer = db.customers;
const UserRole = db.userRoles;
const userProject = db.userProjects;

const getAddOrUpdateUser = async (req, res) => {
  /*
   *  #swagger.tags = ["User"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const body = { ...req.body };
    delete body.verifiedAt;
    delete body.status;
    delete body.type;

    const { name, email, password } = body;

    if (password) {
      const db = await getTenantDB();
      await db.models.customers.findOneAndUpdate(
        { email },
        { password },
        { upsert: true });
    }

    const user = await req.models.user.findOneAndUpdate(
      { email },
      { ...req.body },
      { new: true, upsert: true });

    if (email && !user.verifiedAt) sendMail({ email, name, tenant: req.tenant }, 'addUser');

    return res.status(200).json(user);
  } catch (error) {
    getError(error, res);
  }
};

const getTeam = async (req, res) => {
  /*
   *  #swagger.tags = ["User"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const team = await User.schema(req.database).findAll({
      attributes: ['id', 'name', 'email', 'profileImage', 'verifiedAt', 'deletedAt', 'active', 'defaultProjectId']
    });
    const filteredTeam = team.filter((el) => el.id !== req.user.id);

    const teamWithImages = await filteredTeam.map(async (user) => {
      let base64ProfileImage = '';
      if (user.dataValues.profileImage) {
        try {
          const getParams = {
            Bucket: req.database.split('_')[1].toLowerCase(),
            Key: user.email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
          };

          const data = await s3.getObject(getParams);

          if (data?.Body) {
            base64ProfileImage = await data.Body.transformToString('base64');
          } else {
            base64ProfileImage = data;
          }
          return {
            ...user.dataValues,
            profileImage: user.dataValues.profileImage ? base64ProfileImage : ''
          };
        } catch (err) {
          console.error('Profile Image Error', err);
          return {
            ...user.dataValues,
            profileImage: ''
          };
        }
      } else {
        return {
          ...user.dataValues,
          profileImage: base64ProfileImage
        };
      }
    });
    Promise.all(teamWithImages)
      .then((data) => res.status(200).json(data))
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    getError(error, res);
  }
};

const deleteUser = async (req, res) => {
  /*
   *  #swagger.tags = ["User"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { userId } = req.params;

    const user = await User.schema(req.database).findByPk(userId);
    if (req.user.tenant === user.email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()) throw new Error('Cannot Delete Customer Admin');
    if (user.verifiedAt) throw new Error('Cannot delete Active User, You can only mark them inactive!');
    await userProject.schema(req.database).destroy({ where: { userId } });
    await UserRole.schema(req.database).destroy({ where: { userId } });
    const deletedUser = await User.schema(req.database).destroy({
      where: {
        id: userId
      }
    });
    if (deletedUser > 0) {
      const deletedCustomerUser = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
        where: {
          email: user.email
        }
      });
      if (deletedCustomerUser > 0) {
        return res.status(200).json({ message: 'User Deleted Successfully' });
      }
    } else {
      throw new Error('User Not Found');
    }
  } catch (error) {
    getError(error, res);
  }
};

const deleteCustomerUser = async (req, res) => {
  /*
   *  #swagger.tags = ["User"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    if (!req.user.customerAdmin) return res.status(401).json({ message: 'Only customer admin can perform this operation!' });

    await deleteCustomer(req.user.email);
    return res.status(200).json({ message: 'Deleted all data!' });
  } catch (error) {
    getError(error, res);
  }
};

const uploadProfileImage = async (req, res) => {
  /*
   *  #swagger.tags = ["User"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const file = req.files.image;
    if (!file) throw new Error('Inavlid Image');
    const bucketName = req.database.split('_')[1].toLowerCase();
    const fileName = req.user.email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    const result = await uploadFile(file, bucketName, fileName);
    if (result) {
      await User.schema(req.database).update(
        { profileImage: true },
        {
          where: {
            id: req.user.id
          }
        }
      );
      return res.status(200).json({ message: successConstants.UPDATED });
    }
    throw new Error('Unable to upload profile image!');
  } catch (error) {
    getError(error, res);
  }
};

const logout = (req, res) => {
  /*
   *  #swagger.tags = ["User"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    if (process.env.JWT_ACCESS_CACHE) cache.del(`accesstoken_${req.user.email}`);
    return res.status(200).json({ message: 'Logout Successfull' });
  } catch (error) {
    getError(error, res);
  }
};

export { deleteCustomerUser, deleteUser, getAddOrUpdateUser, getTeam, logout, uploadProfileImage };
