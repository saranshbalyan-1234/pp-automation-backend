import errorContstants from "#constants/error.js";
import getError from "#utils/error.js";
import db from "#utils/dataBaseConnection.js";
import { idValidation } from "#validations/index.js";
const UserProject = db.userProjects;

const validatePermission = (permissionName, method) => {
    return async (req, res, next) => {
        try {
            if (!req.user.customerAdmin) {
                const allowed = await req.user.permissions.some((permission) => {
                    return permissionName == permission.name && permission[method] == true;
                });
                if (!allowed) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
            }
            next();
        } catch (e) {
            return getError(e, res);
        }
    };
};

const validateSuperAdmin = () => {
    return async (req, res, next) => {
        try {
            if (!req.user.superAdmin) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
            next();
        } catch (e) {
            return getError(e, res);
        }
    };
};
const validateCustomerAdmin = () => {
    return async (req, res, next) => {
        try {
            if (!req.user.customerAdmin) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
            next();
        } catch (e) {
            return getError(e, res);
        }
    };
};

const validateUserProject = () => {
    return async (req, res, next) => {
        try {
            const projectId = req.params.projectId || req.headers["x-project-id"];
            const { error } = idValidation.validate({ id: projectId });
            if (error) throw new Error(error.details[0].message);

            const userProject = await UserProject.schema(req.database).findOne({
                where: { userId: req.user.id, projectId },
            });
            if (!userProject) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });

            next();
        } catch (e) {
            return getError(e, res);
        }
    };
};

export { validatePermission, validateSuperAdmin, validateCustomerAdmin, validateUserProject };
