import express from "express";
import {
    getAllReusableProcess,
    saveReusableProcess,
    updateReusableProcess,
    deleteReusableProcess,
    getReusableProcessDetailsById,
    getTestStepByReusableProcess,
    createReusableProcessLog,
    getReusableProcessLogsById,
    convertToReusableProcess,
} from "../Controllers/reusableProcessController.js";
import { validatePermission } from "#middlewares/permissions.js";
const Router = express.Router();

Router.post("/", validatePermission("Reusable Process", "add"), saveReusableProcess);
Router.put("/:reusableProcessId", validatePermission("Reusable Process", "edit"), updateReusableProcess);
Router.get("/:reusableProcessId/details", validatePermission("Reusable Process", "view"), getReusableProcessDetailsById);

Router.get("/", validatePermission("Reusable Process", "view"), getAllReusableProcess);

Router.get("/:reusableProcessId/teststeps", validatePermission("Reusable Process", "view"), getTestStepByReusableProcess);

Router.delete("/:reusableProcessId", validatePermission("Reusable Process", "delete"), deleteReusableProcess);

Router.post("/:reusableProcessId/logs", createReusableProcessLog);
Router.get("/:reusableProcessId/logs", validatePermission("Reusable Process", "view"), getReusableProcessLogsById);

Router.put("/convert/process/:processId", validatePermission("Reusable Process", "view"), convertToReusableProcess);

export default Router;
