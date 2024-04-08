import express from "express";
import {
    saveObject,
    updateObject,
    deleteObject,
    getAllObject,
    getObjectDetailsById,
    saveObjectLocator,
    getObjectLocatorsByObjectId,
    deleteObjectLocator,
    getObjectLogsByObjectId,
    createObjectLog,
} from "../Controllers/object.js";
import { validatePermission } from "#middlewares/permissions.js";
const Router = express.Router();

Router.post("/", validatePermission("Test Case", "add"), saveObject);
Router.put("/:objectId", validatePermission("Test Object", "edit"), updateObject);
Router.delete("/:objectId", validatePermission("Test Object", "delete"), deleteObject);
Router.delete("/locator/:locatorId", validatePermission("Test Object", "edit"), deleteObjectLocator);

Router.get("/", validatePermission("Test Object", "view"), getAllObject);
Router.get("/:objectId/details", validatePermission("Test Object", "view"), getObjectDetailsById);

Router.get("/:objectId/locator", validatePermission("Test Object", "view"), getObjectLocatorsByObjectId);
Router.post("/locator", validatePermission("Test Object", "add"), saveObjectLocator);

Router.post("/:objectId/logs", createObjectLog);
Router.get("/:objectId/logs", validatePermission("Test Object", "view"), getObjectLogsByObjectId);

export default Router;
