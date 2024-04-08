import getError from "#utils/error.js";
import { syncDatabase, deleteCustomer, getCachedKeys } from "../Service/database.js";
import _ from "lodash";
import cache from "#utils/cache.js";

const deleteCustomerByAdmin = async (req, res) => {
    /*  #swagger.tags = ["Super Admin"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const { customerEmail } = req.body;
        await deleteCustomer(customerEmail);
        return res.status(200).json({ message: "Deleted all data!" });
    } catch (error) {
        getError(error, res);
    }
};

const syncTenant = async (req, res) => {
    /*  #swagger.tags = ["Super Admin"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const { customerEmail, force = false, alter = false } = req.body;
        let tenant = customerEmail.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
        const tables = await syncDatabase(process.env.DATABASE_PREFIX + tenant, force, alter);
        return res.status(200).json({ message: `Synced Database ${tenant}`, tables });
    } catch (error) {
        getError(error, res);
    }
};

const getAllSession = async (req, res) => {
    /*  #swagger.tags = ["Super Admin"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const sessions = getCachedKeys();
        const sessionObj = sessions
            .filter((el) => el.split("_")[0] == "accesstoken")
            .map((el) => {
                let temp = {};
                let tempArr = el.split("_");
                temp.tenant = tempArr[1];
                temp.email = tempArr[2];
                return temp;
            });
        const result = _.groupBy(sessionObj, "tenant");

        return res.status(200).json(result);
    } catch (error) {
        getError(error, res);
    }
};

const terminateSession = async (req, res) => {
    /*  #swagger.tags = ["Super Admin"] 
     #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const { tenant, email } = req.body;
        if (process.env.JWT_ACCESS_CACHE) cache.del(`accesstoken_${tenant}_${email}`);
        return res.status(200).json({ message: "Session Terminated!" });
    } catch (error) {
        getError(error, res);
    }
};

export { deleteCustomerByAdmin, syncTenant, getAllSession, terminateSession };
