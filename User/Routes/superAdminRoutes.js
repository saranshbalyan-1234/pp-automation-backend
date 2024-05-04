import express from 'express';

import { validateSuperAdmin } from '#Middlewares/permissions.middleware.js';

import { deleteCustomerByAdmin, getAllSession, terminateSession } from '../Controllers/superAdminController.js';

const Router = express.Router();

Router.use(validateSuperAdmin());

Router.post('/delete', deleteCustomerByAdmin);
Router.post('/sessions', getAllSession);
Router.post('/terminate-sessions', terminateSession);

export default Router;
