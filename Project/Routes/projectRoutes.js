import express from "express";
import { getMyProject, getProjectById, addProject, deleteProject, addMember, deleteMember, editProject } from "../Controllers/projectController.js";
import { validatePermission, validateUserProject } from "#middlewares/permissions.js";
const Router = express.Router();

Router.get("/", validatePermission("Project", "view"), getMyProject);
Router.get("/:projectId", validatePermission("Project", "view"), validateUserProject(), getProjectById);
Router.post("/", validatePermission("Project", "add"), addProject);
Router.post("/addMember", validatePermission("Project", validateUserProject(), "edit"), addMember);
Router.post("/removeMember", validatePermission("Project", "edit"), validateUserProject(), deleteMember);
Router.delete("/:projectId", validatePermission("Project", "delete"), validateUserProject(), deleteProject);
Router.put("/", validatePermission("Project", "edit"), validateUserProject(), editProject);
export default Router;
