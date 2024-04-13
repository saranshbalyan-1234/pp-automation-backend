import { actionEvents } from '#constants/actionEvents.js';
import { permissionList } from '#constants/permission.js';
import getError from '#utils/error.js';

const getAllPermission = (req, res) => {
  /*
   *  #swagger.tags = ["Constant"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const data = permissionList.sort((a, b) => a.name > b.name ? 1 : -1);
    return res.status(200).json(data);
  } catch (error) {
    getError(error, res);
  }
};

const getAllActionEvent = (req, res) => {
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
