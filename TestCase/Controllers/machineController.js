import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import { idValidation } from "#validations/index.js";
import errorContstants from "#constants/error.js";
const Machine = db.machines;

export const addMachine = async (req, res) => {
    /*  #swagger.tags = ["Machine"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        if (!req.user.customerAdmin) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });

        const { name, url } = req.body;

        const machine = await Machine.schema(req.database).create({
            name,
            url,
        });

        return res.status(200).json(machine);
    } catch (error) {
        getError(error, res);
    }
};

export const getAllMachine = async (req, res) => {
    /*  #swagger.tags = ["Machine"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const machines = await Machine.schema(req.database).findAll({
            attributes: ["id", "name", "url", "createdAt"],
        });

        return res.status(200).json(machines);
    } catch (error) {
        getError(error, res);
    }
};

export const removeMachine = async (req, res) => {
    /*  #swagger.tags = ["Machine"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        if (!req.user.customerAdmin) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
        const machineId = req.params.machineId;
        const { error } = idValidation.validate({ id: machineId });
        if (error) throw new Error(error.details[0].message);

        const deletedMachine = await Machine.schema(req.database).destroy({
            where: { id: machineId },
        });
        if (deletedMachine > 0) return res.status(200).json({ message: "Machine deleted successfully!" });
        else return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
    } catch (error) {
        getError(error, res);
    }
};
