import joi from '@hapi/joi';

const updateNameValidation = joi.object({
  name: joi.string().min(3).max(100).required(),
  roleId: joi.number().integer().required()
});
const updatePermissionValidation = joi.object({
  add: joi.boolean().required(),
  delete: joi.boolean().required(),
  edit: joi.boolean().required(),
  name: joi.string().min(3).max(100).required(),
  view: joi.boolean().required()
});

export { updateNameValidation, updatePermissionValidation };
