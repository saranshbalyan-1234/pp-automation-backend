import { decryptData, encryptData } from '../Controller/aes.controller.js';
import express from 'express';
const Router = express.Router();

Router.post('/decrypt', decryptData);
Router.post('/encrypt', encryptData);

export default Router;
