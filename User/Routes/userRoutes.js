import express from 'express';
import { validate } from 'express-validation';

import { validateCustomerAdmin, validatePermission } from '#middlewares/permissions.middleware.js';

import {
  changePassword,
  deleteCustomerUser,
  deleteUser,
  getTeam,
  getUserDetailsByEmail,
  logout,
  resendVerificationEmail,
  uploadProfileImage
} from '../Controllers/user.controller.js';
import { emailBodyValidation } from '../Validations/auth.js';
import { changePasswordValidation, userIdParamsValidation } from '../Validations/user.js';

const Router = express.Router();

Router.delete('/customer', validateCustomerAdmin(), deleteCustomerUser);
Router.get('/team', validatePermission('Team', 'view'), getTeam);
Router.get('/', getUserDetailsByEmail);
Router.post('/', validate(emailBodyValidation), getUserDetailsByEmail);
// Router.post('/add', validatePermission('Team', 'add'), validate(registerValidation), addUser);
Router.post('/resend-verification-email', validate(emailBodyValidation), resendVerificationEmail);
Router.delete('/:userId', validatePermission('Team', 'delete'), validate(userIdParamsValidation), deleteUser);
// Router.put('/:userId/status', validatePermission('Team', 'edit'), validate(activeInactiveValidation), changeDetails);
Router.put('/uploadProfileImage', uploadProfileImage);
// Router.put('/details', validate(changeDetailsValidation), changeDetails);
Router.put('/change-password', validate(changePasswordValidation), changePassword);
Router.get('/logout', logout);

// Router.get("/my-status", myStatus);
export default Router;
