import express from "express";
import {
    addUser,
    deleteUser,
    changePassword,
    changeDetails,
    getTeam,
    resendVerificationEmail,
    deleteCustomerUser,
    uploadProfileImage,
    getUserDetailsByEmail,
    logout,
    // toggleUserActiveInactive,
    // myStatus,
} from "../Controllers/userController.js";
import { emailBodyValidation, registerValidation } from "../Validations/auth.js";
import { changePasswordValidation, changeDetailsValidation, activeInactiveValidation, userIdParamsValidation } from "../Validations/user.js";
import { validate } from "express-validation";
import { validateCustomerAdmin } from "#middlewares/permissions.js";
import { validatePermission } from "#middlewares/permissions.js";

const Router = express.Router();

Router.delete("/customer", validateCustomerAdmin(), deleteCustomerUser);
Router.get("/team", validatePermission("Team", "view"), getTeam);
Router.get("/", getUserDetailsByEmail);
Router.post("/", validate(emailBodyValidation), getUserDetailsByEmail);
Router.post("/add", validatePermission("Team", "add"), validate(registerValidation), addUser);
Router.post("/resend-verification-email", validate(emailBodyValidation), resendVerificationEmail);
Router.delete("/:userId", validatePermission("Team", "delete"), validate(userIdParamsValidation), deleteUser);
Router.put("/:userId/status", validatePermission("Team", "edit"), validate(activeInactiveValidation), changeDetails);
Router.put("/uploadProfileImage", uploadProfileImage);
Router.put("/details", validate(changeDetailsValidation), changeDetails);
Router.put("/change-password", validate(changePasswordValidation), changePassword);
Router.get("/logout", logout);

// Router.get("/my-status", myStatus);
export default Router;
