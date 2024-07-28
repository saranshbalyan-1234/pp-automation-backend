import { Joi } from 'express-validation';
const loginValidation = {
  body: Joi.object({
    email: Joi.string().min(5).required().email(),
    password: Joi.string().min(5).max(15).required(),
    rememberMe: Joi.boolean()
  })
};
const registerValidation = {
  body: Joi.object({
    email: Joi.string().min(5).required().email(),
    name: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(8).max(15).required(),
    tenant: Joi.string()
  })
};

const emailBodyValidation = {
  body: Joi.object({
    email: Joi.string().min(5).required().email()
  })
};

const tokenParamsValidation = {
  params: Joi.object({
    token: Joi.string().required()
  })
};

const passwordBodyValidation = {
  body: Joi.object({
    password: Joi.string().min(5).max(15).required()
  })
};

export { emailBodyValidation, loginValidation, passwordBodyValidation, registerValidation, tokenParamsValidation };
