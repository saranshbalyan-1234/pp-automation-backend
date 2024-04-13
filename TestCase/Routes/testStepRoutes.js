import express from 'express';

import { deleteTestStep, saveTestStep, updateTestStep } from '../Controllers/testStepController.js';
// Import { validatePermission } from "#middlewares/permissions.js";
const Router = express.Router();

Router.post('/', saveTestStep);
Router.put(
  '/:testStepId',
  // ValidatePermission("Test Case", "edit"),
  updateTestStep
);
Router.delete(
  '/:testStepId',
  // ValidatePermission("Test Case", "edit"),
  deleteTestStep
);
export default Router;
