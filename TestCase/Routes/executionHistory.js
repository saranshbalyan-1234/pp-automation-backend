import express from 'express';

import { permissionList, permissionTypes } from '#constants/permission.js';
import { validatePermission } from '#middlewares/permissions.js';

import { deleteExecutionHistoryById, deleteExecutionHistoryByTestCase, getAllExecutionHistoryByTestCase, getExecutionHistoryById } from '../Controllers/executionHistory.js';
const Router = express.Router();

const executionHistoryId = 'executionHistoryId';
const testcaseId = 'testCaseId';

Router.delete(`/:${executionHistoryId}`, validatePermission(permissionList.execute, permissionTypes.delete), deleteExecutionHistoryById);
Router.delete(`/testCase/:${testcaseId}`, validatePermission(permissionList.execute, permissionTypes.delete), deleteExecutionHistoryByTestCase);
Router.get(`/:${executionHistoryId}`, validatePermission(permissionList.execute, permissionTypes.view), getExecutionHistoryById);
Router.get(`/testCase/:${testcaseId}`, validatePermission(permissionList.execute, permissionTypes.view), getAllExecutionHistoryByTestCase);

export default Router;
