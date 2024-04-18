import express from 'express';

import {  getAllPermission } from '../Controllers/constantController.js';
const Router = express.Router();
Router.get('/permission', getAllPermission);

export default Router;
