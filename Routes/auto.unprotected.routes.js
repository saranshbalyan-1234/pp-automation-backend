import express from 'express';

// import { createdReport, dashboard } from '../Controllers/dashboardController.js';
const Router = express.Router();

Router.get('/saransh', (_req, res) => {
  res.status(200).json('test routes');
});

/*
 * Router.get('/', dashboard);
 * Router.post('/created-report', createdReport);
 */

export default Router;
