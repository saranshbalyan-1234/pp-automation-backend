import express from 'express';

import { permissionList, permissionTypes } from '#constants/permission.js';
import { validatePermission } from '#middlewares/permissions.js';

import {
  addExecutionSuite,
  addTestCaseToExecutionSuite,
  deleteExecutionSuite,
  editExecutionSuite,
  getAllExecutionSuite,
  getExecutionSuiteDetailsById,
  getTestCaseByExecutionSuiteId,
  removeTestCaseFromExecutionSuite
} from '../Controllers/executionSuiteController.js';

const Router = express.Router();

const executionSuiteId = 'executionSuiteId';
const permissionName = permissionList.executionSuite;

Router.post('/', validatePermission(permissionName, permissionTypes.add), addExecutionSuite);
Router.put(`/:${executionSuiteId}`, validatePermission(permissionName, permissionTypes.edit), editExecutionSuite);
Router.get('/', validatePermission(permissionName, permissionTypes.view), getAllExecutionSuite);
Router.get(`/:${executionSuiteId}/details`, validatePermission(permissionName, permissionTypes.view), getExecutionSuiteDetailsById);
Router.delete(`/:${executionSuiteId}`, validatePermission(permissionName, permissionTypes.delete), deleteExecutionSuite);
Router.get(`/:${executionSuiteId}/test-case`, validatePermission(permissionName, permissionTypes.view), getTestCaseByExecutionSuiteId);
Router.post('/add-test-case', validatePermission(permissionName, permissionTypes.edit), addTestCaseToExecutionSuite);
Router.delete('/remove-test-case/:id', validatePermission(permissionName, permissionTypes.edit), removeTestCaseFromExecutionSuite);

export default Router;
