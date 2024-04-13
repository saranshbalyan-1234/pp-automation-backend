import errorContstants from '#constants/error.js';
import db from '#utils/dataBaseConnection.js';
import getError from '#utils/error.js';
import { idValidation } from '#validations/index.js';
const UserProject = db.userProjects;

const validatePermission = (permissionName, method) => async (req, res, next) => {
  try {
    if (!req.user.customerAdmin) {
      const allowed = await req.user.permissions.some((permission) => permissionName === permission.name && permission[method] === true);
      if (!allowed) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
    }
    return next();
  } catch (e) {
    return getError(e, res);
  }
};

const validateSuperAdmin = () => (req, res, next) => {
  try {
    if (!req.user.superAdmin) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
    return next();
  } catch (e) {
    return getError(e, res);
  }
};
const validateCustomerAdmin = () => (req, res, next) => {
  try {
    if (!req.user.customerAdmin) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
    return next();
  } catch (e) {
    return getError(e, res);
  }
};

const validateUserProject = () => async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.headers['x-project-id'];
    const { error } = idValidation.validate({ id: projectId });
    if (error) throw new Error(error.details[0].message);

    const userProject = await UserProject.schema(req.database).findOne({
      where: { projectId, userId: req.user.id }
    });
    if (!userProject) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });

    return next();
  } catch (e) {
    return getError(e, res);
  }
};

export { validateCustomerAdmin, validatePermission, validateSuperAdmin, validateUserProject };
