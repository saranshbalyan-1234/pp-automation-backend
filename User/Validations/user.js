import { Joi } from 'express-validation';

const changePasswordValidation = {
  body: Joi.object({
    newPassword: Joi.string().min(8).max(15).required(),
    oldPassword: Joi.string().min(8).max(15).required()
  })
};

const changeDetailsValidation = {
  body: Joi.object({
    defaultProjectId: Joi.number().integer(),
    name: Joi.string().max(100)
  })
};

const activeInactiveValidation = {
  body: Joi.object({
    active: Joi.boolean().required()
  }),
  params: Joi.object({ userId: Joi.number().integer().required() })
};

const userIdParamsValidation = {
  params: Joi.object({ userId: Joi.number().integer().required() })
};

export { activeInactiveValidation, changeDetailsValidation, changePasswordValidation, userIdParamsValidation };
