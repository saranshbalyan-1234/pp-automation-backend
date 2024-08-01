import express from 'express';

import { validateSuperAdmin } from '#middlewares/permissions.middleware.js';

import { deleteCustomerByAdmin, getAllSession, getAllTenant, terminateSession } from '../Controllers/superAdmin.controller.js';
const Router = express.Router();

Router.use(validateSuperAdmin());

Router.get('/tenant', getAllTenant);
Router.post('/delete', deleteCustomerByAdmin);
Router.get('/session', getAllSession);
Router.post('/terminate-session', terminateSession);

export default Router;
