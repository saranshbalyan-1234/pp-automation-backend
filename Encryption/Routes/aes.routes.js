import express from 'express';

import { decryptData, encryptData } from '../Controller/aes.controller.js';
const Router = express.Router();

Router.post('/decrypt', decryptData);
Router.post('/encrypt', encryptData);

export default Router;
