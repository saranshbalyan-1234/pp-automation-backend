import express from 'express';

import { permissionList, permissionTypes } from '#constants/permission.js';
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

const testCaseId = 'testCaseId';
const processId = 'processId';

Router.post('/', validatePermission(permissionList.testCase, permissionTypes.add), saveTestCase);
Router.post('/process', validatePermission(permissionList.testCase, permissionTypes.edit), saveProcess);

Router.put(`/process/:${processId}`, validatePermission(permissionList.testCase, permissionTypes.edit), updateProcess);
Router.delete(`/process/:${processId}`, validatePermission(permissionList.testCase, permissionTypes.edit), deleteProcess);

Router.put(`/:${testCaseId}`, validatePermission(permissionList.testCase, permissionTypes.edit), updateTestCase);
Router.get(`/:${testCaseId}/details`, validatePermission(permissionList.testCase, permissionTypes.view), getTestCaseDetailsById);

Router.get('/', validatePermission(permissionList.testCase, permissionTypes.view), getAllTestCase);

Router.get(`/:${testCaseId}/teststeps`, validatePermission(permissionList.testCase, permissionTypes.view), getTestStepByTestCase);

Router.delete(`/:${testCaseId}`, validatePermission(permissionList.testCase, permissionTypes.delete), deleteTestCase);

Router.post(`/:${testCaseId}/logs`, validatePermission(permissionList.testCase, permissionTypes.edit), createTestCaseLog);
Router.get(`/:${testCaseId}/logs`, validatePermission(permissionList.testCase, permissionTypes.view), getTestCaseLogsById);

export default Router;
