import express from "express";
import { register, login, verifyCustomer, verifyUser, sendResetPasswordMail, resetPassword, refreshToken } from "../Controllers/authController.js";
import { loginValidation, registerValidation, emailBodyValidation, tokenBodyValidation } from "../Validations/auth.js";
import { validate } from "express-validation";
const Router = express.Router();

Router.post("/register", validate(registerValidation), register);
Router.post("/login", validate(loginValidation), login);
Router.post("/verify-customer", validate(tokenBodyValidation), verifyCustomer);
Router.post("/verify-user", validate(tokenBodyValidation), verifyUser);
Router.post("/reset-password/send-mail", validate(emailBodyValidation), sendResetPasswordMail);
Router.post("/reset-password", validate(tokenBodyValidation), resetPassword);
Router.post("/refresh-token", validate(tokenBodyValidation), refreshToken);

export default Router;
