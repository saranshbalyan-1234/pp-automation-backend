import express from 'express';

// import { validate } from 'express-validation';
import { getAllRole, getCreateOrUpdateRole } from '../Controllers/role.controller.js';
// import { emailBodyValidation, loginValidation, passwordBodyValidation, registerValidation, tokenParamsValidation } from '../Validations/auth.js';
const Router = express.Router();

Router.post('/', getCreateOrUpdateRole);
Router.get('/', getAllRole);

export default Router;
