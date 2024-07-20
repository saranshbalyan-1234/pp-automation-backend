import express from 'express';

// import { validate } from 'express-validation';
import { createOrUpdateRole } from '../Controllers/role.controller.js';
// import { emailBodyValidation, loginValidation, passwordBodyValidation, registerValidation, tokenParamsValidation } from '../Validations/auth.js';
const Router = express.Router();

Router.post('/', createOrUpdateRole);

export default Router;
