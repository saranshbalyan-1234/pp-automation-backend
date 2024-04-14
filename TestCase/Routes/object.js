import express from 'express';

import { permissionList, permissionTypes } from '#constants/permission.js';
import { validatePermission } from '#middlewares/permissions.js';

import {
  createObjectLog,
  deleteObject,
  deleteObjectLocator,
  getAllObject,
  getObjectDetailsById,
  getObjectLocatorsByObjectId,
  getObjectLogsByObjectId,
  saveObject,
  saveObjectLocator,
  updateObject
} from '../Controllers/object.js';

const Router = express.Router();

const objectId = 'objectId';
const permissionName = permissionList.testCase;

Router.post('/', validatePermission(permissionName, permissionTypes.add), saveObject);
Router.put(`/:${objectId}`, validatePermission(permissionName, permissionTypes.edit), updateObject);
Router.delete(`/:${objectId}`, validatePermission(permissionName, permissionTypes.delete), deleteObject);
Router.delete('/locator/:locatorId', validatePermission(permissionName, permissionTypes.edit), deleteObjectLocator);

Router.get('/', validatePermission(permissionName, permissionTypes.view), getAllObject);
Router.get(`/:${objectId}/details`, validatePermission(permissionName, permissionTypes.view), getObjectDetailsById);

Router.get(`/:${objectId}/locator`, validatePermission(permissionName, permissionTypes.view), getObjectLocatorsByObjectId);
Router.post('/locator', validatePermission(permissionName, permissionTypes.add), saveObjectLocator);

Router.post(`/:${objectId}/logs`, createObjectLog);
Router.get(`/:${objectId}/logs`, validatePermission(permissionName, permissionTypes.view), getObjectLogsByObjectId);

export default Router;
