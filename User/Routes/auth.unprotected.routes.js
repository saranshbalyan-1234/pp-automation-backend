import express from 'express';
import { validate } from 'express-validation';

import { login, refreshToken, register, resetPassword, sendResetPasswordMail, verifyCustomer, verifyUser } from '../Controllers/auth.controller.js';
import { emailBodyValidation, loginValidation, passwordBodyValidation, registerValidation, tokenParamsValidation } from '../Validations/auth.js';
const Router = express.Router();

Router.post('/register', validate(registerValidation), register);
Router.post('/login', validate(loginValidation), login);
Router.get('/verify-customer/:token', validate(tokenParamsValidation), verifyCustomer);
Router.get('/verify-user/:token', verifyUser);
Router.post('/reset-password/send-mail', validate(emailBodyValidation), sendResetPasswordMail);
Router.get('/reset-password/:token', validate(tokenParamsValidation), validate(passwordBodyValidation), resetPassword);
Router.get('/refresh-token/:token', refreshToken);

export default Router;
