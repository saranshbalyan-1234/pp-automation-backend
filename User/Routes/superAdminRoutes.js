import express from "express";
import { deleteCustomerByAdmin, syncTenant, getAllSession, terminateSession } from "../Controllers/superAdminController.js";
import { validateSuperAdmin } from "#middlewares/permissions.js";

const Router = express.Router();

Router.use(validateSuperAdmin());

Router.post("/delete", deleteCustomerByAdmin);
Router.post("/sync", syncTenant);
Router.post("/sessions", getAllSession);
Router.post("/terminate-sessions", terminateSession);

export default Router;
