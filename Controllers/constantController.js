import { actionEvents } from '#constants/actionEvents.js';
import { permissionList } from '#constants/permission.js';
import getError from '#utils/error.js';

const getAllPermission = (_req, res) => {
  /*
   *  #swagger.tags = ["Constant"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    // Const data = permissionList.sort((a, b) => a.name > b.name ? 1 : -1);
    return res.status(200).json(permissionList);
  } catch (error) {
    getError(error, res);
  }
};

const getAllActionEvent = (_req, res) => {
  /*
   *  #swagger.tags = ["Constant"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const data = actionEvents.sort((a, b) => a.name > b.name ? 1 : -1);
    return res.status(200).json(data);
  } catch (error) {
    getError(error, res);
  }
};

export { getAllActionEvent, getAllPermission };
