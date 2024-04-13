import getError from '#utils/error.js';

import { decryptWithAES, encryptWithAES } from '../Service/aes.service.js';

const encryptData = (req, res) => {
  /*
   *  #swagger.tags = ["Encryption"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { data } = req.body;
    const encrypted = encryptWithAES(data);
    return res.status(200).json(encrypted);
  } catch (error) {
    getError(error, res);
  }
};

const decryptData = (req, res) => {
  /*
   *  #swagger.tags = ["Encryption"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { encrypted } = req.body;
    const decrypted = decryptWithAES(encrypted);
    return res.status(200).json(decrypted);
  } catch (error) {
    getError(error, res);
  }
};

export { decryptData, encryptData };
