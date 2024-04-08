import express from "express";
import { addMachine, getAllMachine, removeMachine } from "../Controllers/machineController.js";
import { validatePermission } from "#middlewares/permissions.js";
const Router = express.Router();
Router.get("/", validatePermission("Test Case", "view"), getAllMachine);
Router.post("/", addMachine);
Router.delete(`/:machineId`, removeMachine);

export default Router;
