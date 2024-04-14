import express from 'express';

import { permissionList, permissionTypes } from '#constants/permission.js';
import { validatePermission } from '#middlewares/permissions.js';

import {
  convertToReusableProcess,
  createReusableProcessLog,
  deleteReusableProcess,
  getAllReusableProcess,
  getReusableProcessDetailsById,
  getReusableProcessLogsById,
  getTestStepByReusableProcess,
  saveReusableProcess,
  updateReusableProcess
} from '../Controllers/reusableProcessController.js';
const Router = express.Router();

const reusableProcessId = 'reusableProcessId';
const permissionName = permissionList.reusableProcess;

Router.post('/', validatePermission(permissionName, permissionTypes.add), saveReusableProcess);
Router.put(`/:${reusableProcessId}`, validatePermission(permissionName, permissionTypes.edit), updateReusableProcess);
Router.get(`/:${reusableProcessId}/details`, validatePermission(permissionName, permissionTypes.view), getReusableProcessDetailsById);

Router.get('/', validatePermission(permissionName, permissionTypes.view), getAllReusableProcess);

Router.get(`/:${reusableProcessId}/teststeps`, validatePermission(permissionName, permissionTypes.view), getTestStepByReusableProcess);

Router.delete(`/:${reusableProcessId}`, validatePermission(permissionName, permissionTypes.delete), deleteReusableProcess);

Router.post(`/:${reusableProcessId}/logs`, createReusableProcessLog);
Router.get(`/:${reusableProcessId}/logs`, validatePermission(permissionName, permissionTypes.view), getReusableProcessLogsById);

Router.put('/convert/process/:processId', validatePermission(permissionName, permissionTypes.view), convertToReusableProcess);

export default Router;
