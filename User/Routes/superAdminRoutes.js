import express from 'express';

import { validateSuperAdmin } from '#middlewares/permissions.js';

import { deleteCustomerByAdmin, getAllSession, syncTenant, terminateSession } from '../Controllers/superAdminController.js';

const Router = express.Router();

Router.use(validateSuperAdmin());

Router.post('/delete', deleteCustomerByAdmin);
Router.post('/sync', syncTenant);
Router.post('/sessions', getAllSession);
Router.post('/terminate-sessions', terminateSession);

export default Router;
