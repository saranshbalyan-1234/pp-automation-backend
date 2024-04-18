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
export { getAllPermission };
