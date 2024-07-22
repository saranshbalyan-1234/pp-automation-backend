import getError from '#utils/error.js';

const getCreateOrUpdateRole = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */

  try {
    const role = await req.models.roles.findOneAndUpdate(
      { _id: req.body._id },
      { ...req.body },
      { new: true, upsert: true });

    return res.status(200).json(role);
  } catch (error) {
    getError(error, res);
  }
};

export { getCreateOrUpdateRole };
