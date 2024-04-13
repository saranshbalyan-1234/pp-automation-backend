import express from 'express';

import { validatePermission } from '#middlewares/permissions.js';

import { addMachine, getAllMachine, removeMachine } from '../Controllers/machineController.js';
const Router = express.Router();
Router.get('/', validatePermission('Test Case', 'view'), getAllMachine);
Router.post('/', addMachine);
Router.delete('/:machineId', removeMachine);

export default Router;
