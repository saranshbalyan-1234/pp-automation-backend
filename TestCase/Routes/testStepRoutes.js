import express from "express";
import { saveTestStep, updateTestStep, deleteTestStep } from "../Controllers/testStepController.js";
// import { validatePermission } from "#middlewares/permissions.js";
const Router = express.Router();

Router.post("/", saveTestStep);
Router.put(
    "/:testStepId",
    // validatePermission("Test Case", "edit"),
    updateTestStep
);
Router.delete(
    "/:testStepId",
    // validatePermission("Test Case", "edit"),
    deleteTestStep
);
export default Router;
