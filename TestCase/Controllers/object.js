import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import { idValidation, nameDesTagPrjValidation, createLogValidation } from "#validations/index.js";
import { updateObjectValidation, saveObjectLocatorValidation } from "#testcase/Validations/object.js";
import errorContstants from "#constants/error.js";

const Object = db.objects;
const ObjectLocator = db.ObjectLocators;
const ObjectLog = db.objectLogs;

const saveObject = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const { error } = nameDesTagPrjValidation.validate(req.body);
        if (error) throw new Error(error.details[0].message);
        const payload = { ...req.body };
        payload.createdByUser = req.user.id;

        const object = await Object.schema(req.database).create(payload);
        createObjectLog(req, res, object.id, [`created the object "${req.body.name}".`]);
        return res.status(200).json(object);
    } catch (err) {
        getError(err, res);
    }
};
const getObjectDetailsById = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const objectId = req.params.objectId;
        const { error } = idValidation.validate({ id: objectId });
        if (error) throw new Error(error.details[0].message);

        const testCase = await Object.schema(req.database).findOne({
            where: {
                id: objectId,
            },
            attributes: ["id", "name", "createdAt", "updatedAt", "description", "tags", "createdByUser"],
            include: [
                {
                    model: ObjectLocator.schema(req.database),
                    as: "locators",
                },
            ],
        });

        return res.status(200).json(testCase);
    } catch (err) {
        getError(err, res);
    }
};

const updateObject = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const objectId = req.params.objectId;
        const { error } = updateObjectValidation.validate({
            ...req.body,
            objectId,
        });
        if (error) throw new Error(error.details[0].message);

        const updatedObject = await Object.schema(req.database).update(req.body, {
            where: {
                id: objectId,
            },
        });

        if (updatedObject[0]) {
            return res.status(200).json({ message: "Object updated successfully!" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

const deleteObject = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const objectId = req.params.objectId;

        const { error } = idValidation.validate({ id: objectId });
        if (error) throw new Error(error.details[0].message);

        const deletedObject = await Object.schema(req.database).destroy({
            where: { id: objectId },
        });

        if (deletedObject > 0) {
            return res.status(200).json({ message: "Object deleted successfully" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

const getAllObject = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const projectId = req.headers["x-project-id"];
        const { error } = idValidation.validate({ id: projectId });
        if (error) throw new Error(error.details[0].message);

        const objects = await Object.schema(req.database).findAll({
            where: {
                projectId,
            },
            attributes: ["id", "name", "createdAt", "updatedAt", "tags", "createdByUser"],
            order: [["name", "ASC"]],
        });

        return res.status(200).json(objects);
    } catch (err) {
        getError(err, res);
    }
};
const getObjectLocatorsByObjectId = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const objectId = req.params.objectId;

        const { error } = idValidation.validate({ id: objectId });
        if (error) throw new Error(error.details[0].message);

        const locators = await ObjectLocator.schema(req.database).findAll({
            where: {
                objectId,
            },
        });

        return res.status(200).json(locators);
    } catch (err) {
        getError(err, res);
    }
};

const saveObjectLocator = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const { error } = saveObjectLocatorValidation.validate(req.body);
        if (error) throw new Error(error.details[0].message);

        const locator = await ObjectLocator.schema(req.database).create(req.body);

        createObjectLog(req, res, req.body.objectId, [`added new "${req.body.type}" locator "${req.body.locator}".`]);

        return res.status(200).json(locator);
    } catch (err) {
        getError(err, res);
    }
};

const deleteObjectLocator = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const locatorId = req.params.locatorId;

        const { error } = idValidation.validate({ id: locatorId });
        if (error) throw new Error(error.details[0].message);

        const deletedLocator = await ObjectLocator.schema(req.database).destroy({
            where: { id: locatorId },
        });

        if (deletedLocator > 0) {
            return res.status(200).json({ message: "ObjectLocator deleted successfully" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

const getObjectLogsByObjectId = async (req, res) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const objectId = req.params.objectId;

        const { error } = idValidation.validate({ id: objectId });
        if (error) throw new Error(error.details[0].message);

        const locators = await ObjectLog.schema(req.database).findAll({
            where: {
                objectId,
            },
            attributes: ["id", "log", "createdAt", "createdByUser"],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json(locators);
    } catch (err) {
        getError(err, res);
    }
};

const createObjectLog = async (req, res, id, logs = []) => {
    /*  #swagger.tags = ["Test Object"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        if (process.env.SAVE_LOGS !== "true") {
            if (logs.length == 0) return res.status(200).json("Logs Off");
            return;
        }
        const objectId = req.params.objectId || id;
        const tempLogs = req.body.logs || logs;

        const { error } = createLogValidation.validate({
            id: objectId,
            logs: tempLogs,
        });
        if (error) throw new Error(error.details[0].message);

        const payload = tempLogs.map((el) => {
            return { log: el, objectId, createdByUser: req.user.id };
        });
        await ObjectLog.schema(req.database).bulkCreate(payload);
        if (logs.length == 0) return res.status(201).json("Log Created");
    } catch (err) {
        if (logs.length == 0) getError(err, res);
        else console.error(err);
    }
};

export {
    getAllObject,
    getObjectDetailsById,
    saveObject,
    updateObject,
    deleteObject,
    getObjectLocatorsByObjectId,
    saveObjectLocator,
    deleteObjectLocator,
    getObjectLogsByObjectId,
    createObjectLog,
};
