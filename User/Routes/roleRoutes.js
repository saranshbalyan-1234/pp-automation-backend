import { deleteRole, getAllRole, getUserRole, saveRole, updateRole, updateRolePermission, updateUserRole } from '../Controllers/roleController.js';
import { validatePermission } from '#middlewares/permissions.js';
import express from 'express';
const Router = express.Router();

Router.get('/', validatePermission('Role', 'view'), getAllRole);
Router.post('/', validatePermission('Role', 'add'), saveRole);
Router.put('/:roleId', validatePermission('Role', 'edit'), updateRole);
Router.put('/:roleId/permission', validatePermission('Role', 'edit'), updateRolePermission);
Router.delete('/:roleId', validatePermission('Role', 'delete'), deleteRole);

Router.get('/user/:userId', validatePermission('Role', 'view'), getUserRole);
Router.put('/user/:userId', validatePermission('Role', 'edit'), updateUserRole);

export default Router;
