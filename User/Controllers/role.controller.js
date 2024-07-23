import getError from '#utils/error.js';

const getCreateOrUpdateRole = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */

  try {
    const role = await req.models.roles.findOneAndUpdate(
      { _id: req.body._id },
      { ...req.body },
      { new: true, upsert: true });

    return res.status(200).json(role);
  } catch (error) {
    getError(error, res);
  }
};

const getAllRole = async (req, res) => {
  /*
   *  #swagger.tags = ["Role"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const roles = await Role.schema(req.database).findAll({
      include: [
        {
          attributes: ['id', 'name', 'view', 'add', 'edit', 'delete'],
          model: Permission.schema(req.database)
        }
      ]
    });
    // Const temp = pageInfo(roles, req.query);
    return res.status(200).json(roles);
  } catch (err) {
    getError(err, res);
  }
};
const deleteRole = async (req, res) => {
  /*
   *  #swagger.tags = ["Role"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { roleId } = req.params;

    const { error } = idValidation.validate({ id: roleId });
    if (error) throw new Error(error.details[0].message);

    const assignedRole = await UserRole.schema(req.database).findOne({
      where: { roleId }
    });
    if (assignedRole) throw new Error('Role is assigned to users!');
    await Permission.schema(req.database).destroy({
      where: { roleId }
    });
    const deletedRole = await Role.schema(req.database).destroy({
      where: {
        id: roleId
      }
    });
    if (deletedRole > 0) {
      return res.status(200).json({ message: 'Role deleted successfully' });
    }
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (err) {
    getError(err, res);
  }
};
const updateRolePermission = async (req, res) => {
  /*
   *  #swagger.tags = ["Role"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { roleId } = req.params;

    const { error } = idValidation.validate({
      id: roleId
    });
    if (error) throw new Error(error.details[0].message);

    const check = Object.values(permissionList).some((el) => req.body.some((el1) => el === el1.name));

    if (check) {
      const payload = [...req.body].map((el) => {
        const { error: validationError } = updatePermissionValidation.validate({
          add: el.add,
          delete: el.delete,
          edit: el.edit,
          name: el.name,
          view: el.view
        });
        if (validationError) throw new Error(validationError.details[0].message);

        return {
          add: el.add,
          delete: el.delete,
          edit: el.edit,
          name: el.name,
          roleId,
          view: el.view
        };
      });

      await Permission.schema(req.database).destroy({
        where: { roleId }
      });
      const permissions = await Permission.schema(req.database).bulkCreate(payload);
      return res.status(200).json(permissions);
    }
    return res.status(400).json({ error: errorContstants.INVALID_PERMISSION });
  } catch (error) {
    getError(error, res);
  }
};

export { getCreateOrUpdateRole };
