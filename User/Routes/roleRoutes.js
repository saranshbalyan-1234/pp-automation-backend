import express from "express";
import { getAllRole, updateRole, saveRole, deleteRole, updateRolePermission, getUserRole, updateUserRole } from "../Controllers/roleController.js";
import { validatePermission } from "#middlewares/permissions.js";
const Router = express.Router();

Router.get("/", validatePermission("Role", "view"), getAllRole);
Router.post("/", validatePermission("Role", "add"), saveRole);
Router.put("/:roleId", validatePermission("Role", "edit"), updateRole);
Router.put("/:roleId/permission", validatePermission("Role", "edit"), updateRolePermission);
Router.delete("/:roleId", validatePermission("Role", "delete"), deleteRole);

Router.get("/user/:userId", validatePermission("Role", "view"), getUserRole);
Router.put("/user/:userId", validatePermission("Role", "edit"), updateUserRole);

export default Router;
