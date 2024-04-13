import express from 'express';

import { validatePermission } from '#middlewares/permissions.js';

import {
  createColumnForEnvironment,
  createEnvironment,
  deleteColumnFromEnvironment,
  deleteEnvironment,
  getAllEnvironmentNamesByTestCase,
  getAllEnvironmentsByTestCase,
  updateColumnValue
} from '../Controllers/environment.js';
const Router = express.Router();

Router.get('/testCase/:testCaseId', validatePermission('Test Case', 'view'), getAllEnvironmentsByTestCase);
Router.get('/names/testCase/:testCaseId', validatePermission('Test Case', 'view'), getAllEnvironmentNamesByTestCase);
Router.post('/', validatePermission('Test Case', 'edit'), createEnvironment);
Router.post('/column/testCase/:testCaseId', validatePermission('Test Case', 'edit'), createColumnForEnvironment);
Router.delete('/column/:name/testCase/:testCaseId', validatePermission('Test Case', 'edit'), deleteColumnFromEnvironment);
Router.delete('/:envId', validatePermission('Test Case', 'edit'), deleteEnvironment);
Router.put('/column/value', validatePermission('Test Case', 'edit'), updateColumnValue);

export default Router;
