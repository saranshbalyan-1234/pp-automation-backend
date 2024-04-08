import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import { updateNameValidation, updatePermissionValidation } from "../Validations/role.js";
import { nameValidation, idValidation } from "#validations/index.js";
import { permissionList } from "#constants/permission.js";
import errorContstants from "#constants/error.js";
const Role = db.roles;
const UserRole = db.userRoles;
const Permission = db.permissions;

const getAllRole = async (req, res) => {
    /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const roles = await Role.schema(req.database).findAll({
            include: [
                {
                    model: Permission.schema(req.database),
                    attributes: ["id", "name", "view", "add", "edit", "delete"],
                },
            ],
        });
        // const temp = pageInfo(roles, req.query);
        return res.status(200).json(roles);
    } catch (err) {
        getError(err, res);
    }
};

const saveRole = async (req, res) => {
    /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const { error } = nameValidation.validate(req.body);
        if (error) throw new Error(error.details[0].message);

        await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
        const data = await Role.schema(req.database).create(req.body);
        return res.status(200).json(data);
    } catch (err) {
        getError(err, res);
    }
};

const updateRole = async (req, res) => {
    /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const roleId = req.params.roleId;
        const name = req.body.name;
        const { error } = updateNameValidation.validate({ roleId, name });
        if (error) throw new Error(error.details[0].message);

        const updatedRole = await Role.schema(req.database).update(
            { name },
            {
                where: {
                    id: roleId,
                },
            }
        );

        if (updatedRole[0]) {
            const role = await Role.schema(req.database).findByPk(roleId);
            return res.status(200).json({ ...role, message: "Role Updated Successfully!" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

const deleteRole = async (req, res) => {
    /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const roleId = req.params.roleId;

        const { error } = idValidation.validate({ id: roleId });
        if (error) throw new Error(error.details[0].message);

        const assignedRole = await UserRole.schema(req.database).findOne({
            where: { roleId },
        });
        if (assignedRole) throw new Error("Role is assigned to users!");
        await Permission.schema(req.database).destroy({
            where: { roleId },
        });
        const deletedRole = await Role.schema(req.database).destroy({
            where: {
                id: roleId,
            },
        });
        if (deletedRole > 0) {
            return res.status(200).json({ message: "Role deleted successfully" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};
const updateRolePermission = async (req, res) => {
    /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const roleId = req.params.roleId;

        const { error } = idValidation.validate({
            id: roleId,
        });
        if (error) throw new Error(error.details[0].message);

        const check = permissionList.some((el) => {
            return req.body.some((el1) => {
                return el.name == el1.name;
            });
        });

        if (check) {
            const payload = [...req.body].map((el) => {
                const { error } = updatePermissionValidation.validate({
                    add: el.add,
                    edit: el.edit,
                    view: el.view,
                    delete: el.delete,
                    name: el.name,
                });
                if (error) throw new Error(error.details[0].message);

                return {
                    add: el.add,
                    edit: el.edit,
                    view: el.view,
                    delete: el.delete,
                    name: el.name,
                    roleId,
                };
            });

            await Permission.schema(req.database).destroy({
                where: { roleId },
            });
            const permissions = await Permission.schema(req.database).bulkCreate(payload);
            return res.status(200).json(permissions);
        } else {
            return res.status(400).json({ error: errorContstants.INVALID_PERMISSION });
        }
    } catch (error) {
        getError(error, res);
    }
};
const getUserRole = async (req, res) => {
    /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const userId = req.params.userId;
        const { error } = idValidation.validate({ id: userId });
        if (error) throw new Error(error.details[0].message);

        const roles = await UserRole.schema(req.database).findAll({
            where: { userId },
            include: [
                {
                    model: Role.schema(req.database),
                    attributes: ["name"],
                },
            ],
        });
        const tempRole = roles.map((el) => {
            const temp = { ...el.dataValues, name: el.dataValues.role.name };
            delete temp.role;
            return temp;
        });

        return res.status(200).json(tempRole);
    } catch (error) {
        getError(error, res);
    }
};

const updateUserRole = async (req, res) => {
    /*  #swagger.tags = ["Role"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const userId = req.params.userId;
        const { error } = idValidation.validate({ id: userId });
        if (error) throw new Error(error.details[0].message);

        await UserRole.schema(req.database).destroy({
            where: { userId },
        });
        await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
        await UserRole.schema(req.database).bulkCreate(req.body);
        return res.status(200).json({ message: "User role updated." });
    } catch (err) {
        getError(err, res);
    }
};

export { saveRole, updateRole, getAllRole, deleteRole, updateRolePermission, updateUserRole, getUserRole };
