import express from 'express';

import { createdReport, dashboard } from '../Controllers/dashboardController.js';
const Router = express.Router();
Router.get('/', dashboard);
Router.post('/created-report', createdReport);

export default Router;
