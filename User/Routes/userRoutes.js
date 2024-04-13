import { activeInactiveValidation, changeDetailsValidation, changePasswordValidation, userIdParamsValidation } from '../Validations/user.js';
import {
  addUser,
  changeDetails,
  changePassword,
  deleteCustomerUser,
  deleteUser,
  getTeam,
  getUserDetailsByEmail,
  logout,
  resendVerificationEmail,
  uploadProfileImage
  /*
   * ToggleUserActiveInactive,
   * myStatus,
   */
} from '../Controllers/userController.js';
import { emailBodyValidation, registerValidation } from '../Validations/auth.js';
import { validate } from 'express-validation';
import { validateCustomerAdmin, validatePermission } from '#middlewares/permissions.js';
import express from 'express';

const Router = express.Router();

Router.delete('/customer', validateCustomerAdmin(), deleteCustomerUser);
Router.get('/team', validatePermission('Team', 'view'), getTeam);
Router.get('/', getUserDetailsByEmail);
Router.post('/', validate(emailBodyValidation), getUserDetailsByEmail);
Router.post('/add', validatePermission('Team', 'add'), validate(registerValidation), addUser);
Router.post('/resend-verification-email', validate(emailBodyValidation), resendVerificationEmail);
Router.delete('/:userId', validatePermission('Team', 'delete'), validate(userIdParamsValidation), deleteUser);
Router.put('/:userId/status', validatePermission('Team', 'edit'), validate(activeInactiveValidation), changeDetails);
Router.put('/uploadProfileImage', uploadProfileImage);
Router.put('/details', validate(changeDetailsValidation), changeDetails);
Router.put('/change-password', validate(changePasswordValidation), changePassword);
Router.get('/logout', logout);

// Router.get("/my-status", myStatus);
export default Router;
