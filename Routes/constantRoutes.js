import express from 'express';

import { getAllActionEvent, getAllPermission } from '../Controllers/constantController.js';
const Router = express.Router();
Router.get('/permission', getAllPermission);
Router.get('/actionEvent', getAllActionEvent);

export default Router;
