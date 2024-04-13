import { emailBodyValidation, loginValidation, registerValidation, tokenBodyValidation } from '../Validations/auth.js';
import { login, refreshToken, register, resetPassword, sendResetPasswordMail, verifyCustomer, verifyUser } from '../Controllers/authController.js';
import { validate } from 'express-validation';
import express from 'express';
const Router = express.Router();

Router.post('/register', validate(registerValidation), register);
Router.post('/login', validate(loginValidation), login);
Router.post('/verify-customer', validate(tokenBodyValidation), verifyCustomer);
Router.post('/verify-user', validate(tokenBodyValidation), verifyUser);
Router.post('/reset-password/send-mail', validate(emailBodyValidation), sendResetPasswordMail);
Router.post('/reset-password', validate(tokenBodyValidation), resetPassword);
Router.post('/refresh-token', validate(tokenBodyValidation), refreshToken);

export default Router;
