import express from "express";
import { getObject } from "../Controllers/awsController.js";
const Router = express.Router();
Router.post("/object", getObject);
export default Router;
