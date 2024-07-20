import errorConstants from '#constants/error.constant.js';
import successConstants from '#constants/success.contant.js';
import getError from '#utils/error.js';

const createRole = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */

  try {
    
    const role = await req.models.roles.findOneAndUpdate(
    { _id: req.body._id },
    { ...req.body },
    { upsert: true ,new: true});
    
    return res.status(200).json(role);
  } catch (error) {
    getError(error, res);
  }
};

export { createRole };
