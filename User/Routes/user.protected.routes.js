import express from 'express';

import {
  getAddOrUpdateUser
} from '../Controllers/user.controller.js';

const Router = express.Router();

Router.post('/', getAddOrUpdateUser);

// Router.delete('/customer', validateCustomerAdmin(), deleteCustomerUser);
// Router.get('/team', validatePermission('Team', 'view'), getTeam);
// Router.get('/', getUserDetailsByEmail);
// Router.post('/', validate(emailBodyValidation), getUserDetailsByEmail);
// Router.post('/add', validatePermission('Team', 'add'), validate(registerValidation), addUser);
// Router.post('/resend-verification-email', validate(emailBodyValidation), resendVerificationEmail);
// Router.delete('/:userId', validatePermission('Team', 'delete'), validate(userIdParamsValidation), deleteUser);
// Router.put('/:userId/status', validatePermission('Team', 'edit'), validate(activeInactiveValidation), changeDetails);
// Router.put('/uploadProfileImage', uploadProfileImage);
// Router.put('/details', validate(changeDetailsValidation), changeDetails);
// Router.put('/change-password', validate(changePasswordValidation), changePassword);
// Router.get('/logout', logout);
// Router.get("/my-status", myStatus);

export default Router;
