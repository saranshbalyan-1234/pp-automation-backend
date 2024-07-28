import express from 'express';

import { deleteCustomerByAdmin, getAllSession, getAllTenant, terminateSession } from '../Controllers/superAdmin.controller.js';

const Router = express.Router();

// Router.use(validateSuperAdmin());

Router.get('/tenant', getAllTenant);
Router.post('/delete', deleteCustomerByAdmin);
Router.post('/sessions', getAllSession);
Router.post('/terminate-sessions', terminateSession);

export default Router;
