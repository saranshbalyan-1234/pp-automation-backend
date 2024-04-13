import { addMachine, getAllMachine, removeMachine } from '../Controllers/machineController.js';
import { validatePermission } from '#middlewares/permissions.js';
import express from 'express';
const Router = express.Router();
Router.get('/', validatePermission('Test Case', 'view'), getAllMachine);
Router.post('/', addMachine);
Router.delete('/:machineId', removeMachine);

export default Router;
