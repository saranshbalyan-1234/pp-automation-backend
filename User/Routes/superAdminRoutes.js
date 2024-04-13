import { deleteCustomerByAdmin, getAllSession, syncTenant, terminateSession } from '../Controllers/superAdminController.js';
import { validateSuperAdmin } from '#middlewares/permissions.js';
import express from 'express';

const Router = express.Router();

Router.use(validateSuperAdmin());

Router.post('/delete', deleteCustomerByAdmin);
Router.post('/sync', syncTenant);
Router.post('/sessions', getAllSession);
Router.post('/terminate-sessions', terminateSession);

export default Router;
