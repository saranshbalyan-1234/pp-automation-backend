import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import { idValidation } from "#validations/index.js";
import { nameTestCaseId, updateColumnValidation } from "../Validations/environment.js";
import errorContstants from "#constants/error.js";
const Environment = db.enviroments;
const Column = db.columns;

const createEnvironment = async (req, res) => {
    /*  #swagger.tags = ["Environment"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        await db.sequelize.transaction(async (transaction) => {
            const { error } = nameTestCaseId.validate(req.body);
            if (error) throw new Error(error.details[0].message);
            const payload = { ...req.body };

            const env = await Environment.schema(req.database).create(payload, { transaction });

            const enviroment = await Environment.schema(req.database).findOne({
                where: {
                    testCaseId: payload.testCaseId,
                },
                attributes: ["id"],
            });

            if (enviroment) {
                const columns = await Column.schema(req.database).findAll({
                    where: { envId: enviroment.id },
                });

                const columnPayload = columns.map((el) => {
                    return { value: null, envId: env.id, name: el.dataValues.name };
                });
                await Column.schema(req.database).bulkCreate(columnPayload, { transaction });
            }

            return res.status(200).json({ ...env.dataValues, message: "Environment Created!" });
        });
    } catch (err) {
        getError(err, res);
    }
};
const getAllEnvironmentsByTestCase = async (req, res) => {
    /*  #swagger.tags = ["Environment"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const testCaseId = req.params.testCaseId;
        const { error } = idValidation.validate({ id: testCaseId });
        if (error) throw new Error(error.details[0].message);
        const enviroments = await Environment.schema(req.database).findAll({
            where: {
                testCaseId,
            },
            attributes: ["id", "name"],
            include: [
                {
                    model: Column.schema(req.database),
                    attributes: ["name", "value"],
                },
            ],
        });
        const env = enviroments.map((el) => {
            let temp = el.dataValues.columns;
            let newKeys = {};
            temp.forEach((el) => {
                newKeys[el.name] = el.value;
            });

            return {
                envId: el.dataValues.id,
                Environment: el.dataValues.name,
                ...newKeys,
            };
        });
        return res.status(200).json(env);
    } catch (err) {
        getError(err, res);
    }
};
const getAllEnvironmentNamesByTestCase = async (req, res) => {
    /*  #swagger.tags = ["Environment"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const testCaseId = req.params.testCaseId;

        const { error } = idValidation.validate({ id: testCaseId });
        if (error) throw new Error(error.details[0].message);
        const enviroments = await Environment.schema(req.database).findAll({
            where: {
                testCaseId,
            },
            attributes: ["id", "name"],
        });
        return res.status(200).json(enviroments);
    } catch (err) {
        getError(err, res);
    }
};

const createColumnForEnvironment = async (req, res) => {
    /*  #swagger.tags = ["Environment"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const columnName = req.body.name;
        const testCaseId = req.params.testCaseId;
        const { error } = nameTestCaseId.validate({
            name: columnName,
            testCaseId,
        });
        if (error) throw new Error(error.details[0].message);

        const enviroments = await Environment.schema(req.database).findAll({
            where: {
                testCaseId,
            },
            attributes: ["id"],
        });

        let payload = enviroments.map((el) => {
            let envId = el.dataValues.id;
            return { envId, name: columnName, value: null };
        });
        await Column.schema(req.database).bulkCreate(payload);

        return res.status(200).json({ message: "Column Created!" });
    } catch (err) {
        getError(err, res);
    }
};
const updateColumnValue = async (req, res) => {
    /*  #swagger.tags = ["Environment"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const { value, envId, name } = req.body;

        const { error } = updateColumnValidation.validate(req.body);
        if (error) throw new Error(error.details[0].message);

        const updateColumnValue = await Column.schema(req.database).update(
            { value },
            {
                where: {
                    envId,
                    name,
                },
            }
        );
        if (updateColumnValue[0]) {
            return res.status(200).json({ message: "Column updated successfully!" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

const deleteColumnFromEnvironment = async (req, res) => {
    /*  #swagger.tags = ["Environment"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const columnName = req.params.name;
        const testCaseId = req.params.testCaseId;

        const { error } = nameTestCaseId.validate({
            name: columnName,
            testCaseId,
        });
        if (error) throw new Error(error.details[0].message);

        const enviroments = await Environment.schema(req.database).findAll({
            where: {
                testCaseId,
            },
            attributes: ["id"],
        });

        let payload = enviroments.map((el) => {
            let envId = el.dataValues.id;
            return envId;
        });
        const deletedColumn = await Column.schema(req.database).destroy({
            where: {
                name: columnName,
                envId: payload,
            },
        });

        if (deletedColumn > 0) {
            return res.status(200).json({ message: "Column Deleted!" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};
const deleteEnvironment = async (req, res) => {
    /*  #swagger.tags = ["Environment"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const envId = req.params.envId;
        const { error } = idValidation.validate({ id: envId });
        if (error) throw new Error(error.details[0].message);
        await Column.schema(req.database).destroy({
            where: {
                envId,
            },
        });
        const deletedEnv = await Environment.schema(req.database).destroy({
            where: {
                id: envId,
            },
        });

        if (deletedEnv > 0) {
            return res.status(200).json({ message: "Environment Deleted!" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

export { createEnvironment, getAllEnvironmentsByTestCase, createColumnForEnvironment, deleteColumnFromEnvironment, updateColumnValue, getAllEnvironmentNamesByTestCase, deleteEnvironment };
