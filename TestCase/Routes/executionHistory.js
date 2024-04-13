import express from 'express';

import { validatePermission } from '#middlewares/permissions.js';

import { deleteExecutionHistoryById, deleteExecutionHistoryByTestCase, getAllExecutionHistoryByTestCase, getExecutionHistoryById } from '../Controllers/executionHistory.js';
const Router = express.Router();

Router.delete('/:executionHistoryId', validatePermission('Execute', 'delete'), deleteExecutionHistoryById);
Router.delete('/testCase/:testCaseId', validatePermission('Execute', 'delete'), deleteExecutionHistoryByTestCase);
Router.get('/:executionHistoryId', validatePermission('Execute', 'view'), getExecutionHistoryById);
Router.get('/testCase/:testCaseId', validatePermission('Execute', 'view'), getAllExecutionHistoryByTestCase);

export default Router;
