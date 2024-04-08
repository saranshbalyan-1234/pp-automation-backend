import express from "express";
import {
    getAllTestCase,
    saveTestCase,
    updateTestCase,
    deleteTestCase,
    getTestCaseDetailsById,
    getTestStepByTestCase,
    saveProcess,
    updateProcess,
    deleteProcess,
    getTestCaseLogsById,
    createTestCaseLog,
} from "../Controllers/testCaseController.js";
import { validatePermission } from "#middlewares/permissions.js";
const Router = express.Router();

Router.post("/", validatePermission("Test Case", "add"), saveTestCase);
Router.post("/process", validatePermission("Test Case", "edit"), saveProcess);

Router.put("/process/:processId", validatePermission("Test Case", "edit"), updateProcess);
Router.delete("/process/:processId", validatePermission("Test Case", "edit"), deleteProcess);

Router.put("/:testCaseId", validatePermission("Test Case", "edit"), updateTestCase);
Router.get("/:testCaseId/details", validatePermission("Test Case", "view"), getTestCaseDetailsById);

Router.get("/", validatePermission("Test Case", "view"), getAllTestCase);

Router.get("/:testCaseId/teststeps", validatePermission("Test Case", "view"), getTestStepByTestCase);

Router.delete("/:testCaseId", validatePermission("Test Case", "delete"), deleteTestCase);

Router.post("/:testCaseId/logs", validatePermission("Test Case", "edit"), createTestCaseLog);
Router.get("/:testCaseId/logs", validatePermission("Test Case", "view"), getTestCaseLogsById);

export default Router;
