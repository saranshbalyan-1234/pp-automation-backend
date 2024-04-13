import express from 'express';

import { validatePermission } from '#middlewares/permissions.js';

import {
  createTestCaseLog,
  deleteProcess,
  deleteTestCase,
  getAllTestCase,
  getTestCaseDetailsById,
  getTestCaseLogsById,
  getTestStepByTestCase,
  saveProcess,
  saveTestCase,
  updateProcess,
  updateTestCase
} from '../Controllers/testCaseController.js';
const Router = express.Router();

Router.post('/', validatePermission('Test Case', 'add'), saveTestCase);
Router.post('/process', validatePermission('Test Case', 'edit'), saveProcess);

Router.put('/process/:processId', validatePermission('Test Case', 'edit'), updateProcess);
Router.delete('/process/:processId', validatePermission('Test Case', 'edit'), deleteProcess);

Router.put('/:testCaseId', validatePermission('Test Case', 'edit'), updateTestCase);
Router.get('/:testCaseId/details', validatePermission('Test Case', 'view'), getTestCaseDetailsById);

Router.get('/', validatePermission('Test Case', 'view'), getAllTestCase);

Router.get('/:testCaseId/teststeps', validatePermission('Test Case', 'view'), getTestStepByTestCase);

Router.delete('/:testCaseId', validatePermission('Test Case', 'delete'), deleteTestCase);

Router.post('/:testCaseId/logs', validatePermission('Test Case', 'edit'), createTestCaseLog);
Router.get('/:testCaseId/logs', validatePermission('Test Case', 'view'), getTestCaseLogsById);

export default Router;
