import errorContstants from '#constants/error.js';
import db from '#utils/dataBaseConnection.js';
import getError from '#utils/error.js';
import { idValidation } from '#validations/index.js';

import { nameTestCaseId, updateColumnValidation } from '../Validations/environment.js';
const Environment = db.enviroments;
const Column = db.columns;

const createEnvironment = async (req, res) => {
  /*
   *  #swagger.tags = ["Environment"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    await db.sequelize.transaction(async (transaction) => {
      const { error } = nameTestCaseId.validate(req.body);
      if (error) throw new Error(error.details[0].message);
      const payload = { ...req.body };

      const env = await Environment.schema(req.database).create(payload, { transaction });

      const enviroment = await Environment.schema(req.database).findOne({
        attributes: ['id'],
        where: {
          testCaseId: payload.testCaseId
        }
      });

      if (enviroment) {
        const columns = await Column.schema(req.database).findAll({
          where: { envId: enviroment.id }
        });

        const columnPayload = columns.map((el) => ({ envId: env.id, name: el.dataValues.name, value: null }));
        await Column.schema(req.database).bulkCreate(columnPayload, { transaction });
      }

      return res.status(200).json({ ...env.dataValues, message: 'Environment Created!' });
    });
  } catch (err) {
    getError(err, res);
  }
};
const getAllEnvironmentsByTestCase = async (req, res) => {
  /*
   *  #swagger.tags = ["Environment"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { testCaseId } = req.params;
    const { error } = idValidation.validate({ id: testCaseId });
    if (error) throw new Error(error.details[0].message);
    const enviroments = await Environment.schema(req.database).findAll({
      attributes: ['id', 'name'],
      include: [
        {
          attributes: ['name', 'value'],
          model: Column.schema(req.database)
        }
      ],
      where: {
        testCaseId
      }
    });
    const env = enviroments.map((el) => {
      const temp = el.dataValues.columns;
      const newKeys = {};

      temp.forEach((el1) => {
        newKeys[el1.name] = el1.value;
      });

      return {
        Environment: el.dataValues.name,
        envId: el.dataValues.id,
        ...newKeys
      };
    });
    return res.status(200).json(env);
  } catch (err) {
    getError(err, res);
  }
};
const getAllEnvironmentNamesByTestCase = async (req, res) => {
  /*
   *  #swagger.tags = ["Environment"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { testCaseId } = req.params;

    const { error } = idValidation.validate({ id: testCaseId });
    if (error) throw new Error(error.details[0].message);
    const enviroments = await Environment.schema(req.database).findAll({
      attributes: ['id', 'name'],
      where: {
        testCaseId
      }
    });
    return res.status(200).json(enviroments);
  } catch (err) {
    getError(err, res);
  }
};

const createColumnForEnvironment = async (req, res) => {
  /*
   *  #swagger.tags = ["Environment"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const columnName = req.body.name;
    const { testCaseId } = req.params;
    const { error } = nameTestCaseId.validate({
      name: columnName,
      testCaseId
    });
    if (error) throw new Error(error.details[0].message);

    const enviroments = await Environment.schema(req.database).findAll({
      attributes: ['id'],
      where: {
        testCaseId
      }
    });

    const payload = enviroments.map((el) => {
      const envId = el.dataValues.id;
      return { envId, name: columnName, value: null };
    });
    await Column.schema(req.database).bulkCreate(payload);

    return res.status(200).json({ message: 'Column Created!' });
  } catch (err) {
    getError(err, res);
  }
};
const updateColumnValue = async (req, res) => {
  /*
   *  #swagger.tags = ["Environment"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { value, envId, name } = req.body;

    const { error } = updateColumnValidation.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const updatedColumnValue = await Column.schema(req.database).update(
      { value },
      {
        where: {
          envId,
          name
        }
      }
    );
    if (updatedColumnValue[0]) {
      return res.status(200).json({ message: 'Column updated successfully!' });
    }
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (err) {
    getError(err, res);
  }
};

const deleteColumnFromEnvironment = async (req, res) => {
  /*
   *  #swagger.tags = ["Environment"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const columnName = req.params.name;
    const { testCaseId } = req.params;

    const { error } = nameTestCaseId.validate({
      name: columnName,
      testCaseId
    });
    if (error) throw new Error(error.details[0].message);

    const enviroments = await Environment.schema(req.database).findAll({
      attributes: ['id'],
      where: {
        testCaseId
      }
    });

    const payload = enviroments.map((el) => {
      const envId = el.dataValues.id;
      return envId;
    });
    const deletedColumn = await Column.schema(req.database).destroy({
      where: {
        envId: payload,
        name: columnName
      }
    });

    if (deletedColumn > 0) {
      return res.status(200).json({ message: 'Column Deleted!' });
    }
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (err) {
    getError(err, res);
  }
};
const deleteEnvironment = async (req, res) => {
  /*
   *  #swagger.tags = ["Environment"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { envId } = req.params;
    const { error } = idValidation.validate({ id: envId });
    if (error) throw new Error(error.details[0].message);
    await Column.schema(req.database).destroy({
      where: {
        envId
      }
    });
    const deletedEnv = await Environment.schema(req.database).destroy({
      where: {
        id: envId
      }
    });

    if (deletedEnv > 0) {
      return res.status(200).json({ message: 'Environment Deleted!' });
    }
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (err) {
    getError(err, res);
  }
};

export { createColumnForEnvironment, createEnvironment, deleteColumnFromEnvironment, deleteEnvironment, getAllEnvironmentNamesByTestCase, getAllEnvironmentsByTestCase, updateColumnValue };
