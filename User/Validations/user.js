import { Joi } from "express-validation";

const changePasswordValidation = {
    body: Joi.object({
        oldPassword: Joi.string().min(8).max(15).required(),
        newPassword: Joi.string().min(8).max(15).required(),
    }),
};

const changeDetailsValidation = {
    body: Joi.object({
        name: Joi.string().max(100),
        defaultProjectId: Joi.number().integer(),
    }),
};

const activeInactiveValidation = {
    body: Joi.object({
        active: Joi.boolean().required(),
    }),
    params: Joi.object({ userId: Joi.number().integer().required() }),
};

const userIdParamsValidation = {
    params: Joi.object({ userId: Joi.number().integer().required() }),
};

export { changePasswordValidation, changeDetailsValidation, activeInactiveValidation, userIdParamsValidation };
