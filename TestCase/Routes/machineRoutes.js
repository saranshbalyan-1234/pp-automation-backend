import express from 'express';

import { permissionList, permissionTypes } from '#constants/permission.js';
import { validatePermission } from '#middlewares/permissions.js';

import { addMachine, getAllMachine, removeMachine } from '../Controllers/machineController.js';

const Router = express.Router();

const machineId = 'machineId';
Router.get('/', validatePermission(permissionList.testCase, permissionTypes.view), getAllMachine);
Router.post('/', addMachine);
Router.delete(`/:${machineId}`, removeMachine);

export default Router;
