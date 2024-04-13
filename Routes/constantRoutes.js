import { getAllActionEvent, getAllPermission } from '../Controllers/constantController.js';
import express from 'express';
const Router = express.Router();
Router.get('/permission', getAllPermission);
Router.get('/actionEvent', getAllActionEvent);

export default Router;
