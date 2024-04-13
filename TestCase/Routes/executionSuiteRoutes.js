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
import { validatePermission } from '#middlewares/permissions.js';
import express from 'express';
const Router = express.Router();

Router.post('/', validatePermission('Execution Suite', 'add'), addExecutionSuite);
Router.put('/:executionSuiteId', validatePermission('Execution Suite', 'edit'), editExecutionSuite);
Router.get('/', validatePermission('Execution Suite', 'view'), getAllExecutionSuite);
Router.get('/:executionSuiteId/details', validatePermission('Execution Suite', 'view'), getExecutionSuiteDetailsById);
Router.delete('/:executionSuiteId', validatePermission('Execution Suite', 'delete'), deleteExecutionSuite);
Router.get('/:executionSuiteId/test-case', validatePermission('Execution Suite', 'view'), getTestCaseByExecutionSuiteId);
Router.post('/add-test-case', validatePermission('Execution Suite', 'edit'), addTestCaseToExecutionSuite);
Router.delete('/remove-test-case/:id', validatePermission('Execution Suite', 'edit'), removeTestCaseFromExecutionSuite);

export default Router;
