import errorContstants from "#constants/error.js";
import { getAwsObject } from "../Service/awsService.js";

export const getObject = async (req, res) => {
    /*  #swagger.tags = ["AWS"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const data = await getAwsObject(req.database.split("_")[1], req.body.fileName);
        if (data) res.status(200).json(data);
        else res.status(400).json({ error: errorContstants.SOMETHING_WENT_WRONG });
    } catch (error) {
        console.error("Unable to get object from AWS S3", error);
        return res.status(400).json({ error: error.message });
    }
};
