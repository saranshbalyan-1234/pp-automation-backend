import { createdReport, dashboard, detailedExecutionReport, executionReport } from '../Controllers/dashboardController.js';
import express from 'express';
const Router = express.Router();
Router.get('/', dashboard);
Router.post('/detailed-execution-report', detailedExecutionReport);
Router.post('/execution-report', executionReport);
Router.post('/created-report', createdReport);

export default Router;
