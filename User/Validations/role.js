import joi from "@hapi/joi";

const updateNameValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
    roleId: joi.number().integer().required(),
});
const updatePermissionValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
    add: joi.boolean().required(),
    edit: joi.boolean().required(),
    view: joi.boolean().required(),
    delete: joi.boolean().required(),
});

export { updateNameValidation, updatePermissionValidation };
