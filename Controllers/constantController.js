import getError from "#utils/error.js";
import { permissionList } from "#constants/permission.js";
import { actionEvents } from "#constants/actionEvents.js";

const getAllPermission = async (req, res) => {
    /*  #swagger.tags = ["Constant"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const data = permissionList.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
        return res.status(200).json(data);
    } catch (error) {
        getError(error, res);
    }
};

const getAllActionEvent = async (req, res) => {
    /*  #swagger.tags = ["Constant"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const data = actionEvents.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
        return res.status(200).json(data);
    } catch (error) {
        getError(error, res);
    }
};

export { getAllPermission, getAllActionEvent };
