import { getObject } from '../Controllers/awsController.js';
import express from 'express';
const Router = express.Router();
Router.post('/object', getObject);
export default Router;
