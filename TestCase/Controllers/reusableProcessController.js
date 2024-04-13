import _ from 'lodash';

import errorContstants from '#constants/error.js';
import { updateReusableProcessValidation } from '#testcase/Validations/reusableProcess.js';
import db from '#utils/dataBaseConnection.js';
import getError from '#utils/error.js';
import { createLogValidation, idValidation, nameDesTagPrjValidation } from '#utils/Validations/index.js';

const Object = db.objects;
const TestParameter = db.testParameters;
const TestStep = db.testSteps;
const ReusableProcess = db.reusableProcess;
const ReusableProcessLog = db.reusableProcessLogs;
const Process = db.process;
const saveReusableProcess = async (req, res) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { error } = nameDesTagPrjValidation.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    const payload = { ...req.body };
    payload.createdByUser = req.user.id;
    const data = await ReusableProcess.schema(req.database).create(payload);

    createReusableProcessLog(req, res, data.id, [`created the reusableProcess "${req.body.name}".`]);

    return res.status(200).json({
      ...data.dataValues,
      message: 'ReusableProcess created successfully!'
    });
  } catch (err) {
    getError(err, res);
  }
};

const updateReusableProcess = async (req, res) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { reusableProcessId } = req.params;
    const { error } = updateReusableProcessValidation.validate({
      ...req.body,
      reusableProcessId
    });
    if (error) throw new Error(error.details[0].message);

    const updatedReusableProcess = await ReusableProcess.schema(req.database).update(req.body, {
      where: {
        id: reusableProcessId
      }
    });

    if (updatedReusableProcess[0]) {
      return res.status(200).json({ message: 'ReusableProcess updated successfully!' });
    }
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (err) {
    getError(err, res);
  }
};

const getAllReusableProcess = async (req, res) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const projectId = req.headers['x-project-id'];
    const { error } = idValidation.validate({ id: projectId });
    if (error) throw new Error(error.details[0].message);

    const reusableProcesses = await ReusableProcess.schema(req.database).findAll({
      attributes: ['id', 'name', 'updatedAt', 'createdAt', 'tags', 'createdByUser'],
      where: {
        projectId
      }
    });

    return res.status(200).json(reusableProcesses);
  } catch (err) {
    getError(err, res);
  }
};

const deleteReusableProcess = async (req, res) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { reusableProcessId } = req.params;
    const { error } = idValidation.validate({
      id: reusableProcessId
    });
    if (error) throw new Error(error.details[0].message);

    const deletedReusableProcess = await ReusableProcess.schema(req.database).destroy({
      where: { id: reusableProcessId }
    });

    if (deletedReusableProcess > 0) {
      return res.status(200).json({ message: 'ReusableProcess deleted successfully' });
    }
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (err) {
    getError(err, res);
  }
};
const getReusableProcessDetailsById = async (req, res) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { reusableProcessId } = req.params;
    const { error } = idValidation.validate({
      id: reusableProcessId
    });
    if (error) throw new Error(error.details[0].message);
    const reusableProcess = await ReusableProcess.schema(req.database).findOne({
      attributes: ['id', 'name', 'createdAt', 'updatedAt', 'description', 'tags', 'createdByUser'],
      where: {
        id: reusableProcessId
      }
    });
    const totalSteps = await TestStep.schema(req.database).count({
      where: { reusableProcessId }
    });

    return res.status(200).json({ ...reusableProcess.dataValues, totalSteps });
  } catch (err) {
    getError(err, res);
  }
};

const getTestStepByReusableProcess = async (req, res) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { reusableProcessId } = req.params;
    const { error } = idValidation.validate({
      id: reusableProcessId
    });
    if (error) throw new Error(error.details[0].message);

    const data = await TestStep.schema(req.database).findAll({
      include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],

      order: [['step', 'ASC']],
      where: { reusableProcessId }
    });

    return res.status(200).json(data);
  } catch (err) {
    getError(err, res);
  }
};

const getReusableProcessLogsById = async (req, res) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { reusableProcessId } = req.params;

    const { error } = idValidation.validate({ id: reusableProcessId });
    if (error) throw new Error(error.details[0].message);

    const logs = await ReusableProcessLog.schema(req.database).findAll({
      attributes: ['id', 'log', 'createdAt', 'createdByUser'],
      order: [['createdAt', 'DESC']],
      where: {
        reusableProcessId
      }
    });

    return res.status(200).json(logs);
  } catch (err) {
    getError(err, res);
  }
};

const createReusableProcessLog = async (req, res, id, logs = []) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    if (process.env.SAVE_LOGS !== 'true') {
      if (logs.length === 0) return res.status(200).json('Logs Off');
      return;
    }

    const reusableProcessId = req.params.reusableProcessId || id;
    const tempLogs = req.body.logs || logs;

    const { error } = createLogValidation.validate({
      id: reusableProcessId,
      logs: tempLogs
    });
    if (error) throw new Error(error.details[0].message);

    const payload = tempLogs.map((el) => ({ createdByUser: req.user.id, log: el, reusableProcessId }));
    await ReusableProcessLog.schema(req.database).bulkCreate(payload);
    if (logs.length === 0) res.status(201).json('Log Created');
  } catch (err) {
    if (logs.length === 0) getError(err, res);
    else console.error(err);
  }
};

const convertToReusableProcess = async (req, res) => {
  /*
   *  #swagger.tags = ["Reusable Process"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    await db.sequelize.transaction(async (transaction) => {
      const { processId } = req.params;
      const projectId = req.headers['x-project-id'];
      const { error } = idValidation.validate({
        id: processId
      });
      if (error) throw new Error(error.details[0].message);

      const processByPk = await Process.schema(req.database).findByPk(processId);

      if (processByPk.dataValues.reusableProcessId) {
        return res.status(200).json({ message: 'Already Reuasable Process!' });
      }

      const reusableProcess = await ReusableProcess.schema(req.database).create(
        {
          createdByUser: req.user.id,
          name: processByPk.dataValues.name,
          projectId
        },
        { transaction }
      );

      const updatedProcess = await Process.schema(req.database).update(
        {
          reusableProcessId: reusableProcess.dataValues.id
        },
        {
          transaction,
          where: {
            id: processByPk.dataValues.id
          }
        }
      );

      TestStep.schema(req.database).update(
        {
          processId: null,
          reusableProcessId: reusableProcess.dataValues.id
        },
        {
          transaction,
          where: { processId }
        }
      );

      if (updatedProcess[0]) {
        const updatedProcessByPk = await Process.schema(req.database).findByPk(
          processId,
          {
            include: [
              {
                include: [
                  {
                    include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],
                    model: TestStep.schema(req.database)
                  }
                ],
                model: ReusableProcess.schema(req.database)
              }
            ]
          },
          { transaction }
        );

        const temp = _.cloneDeep(updatedProcessByPk);

        if (temp.dataValues.reusableProcess) {
          temp.dataValues.testSteps = temp.dataValues.reusableProcess.dataValues.testSteps;
          delete temp.reusableProcess.dataValues.testSteps;
        } else {
          delete temp.dataValues.testSteps;
        }
        return res.status(200).json({ ...temp.dataValues, message: 'Converted to Reuasable Process!' });
      }
      return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
    });
  } catch (err) {
    getError(err, res);
  }
};

export {
  convertToReusableProcess,
  createReusableProcessLog,
  deleteReusableProcess,
  getAllReusableProcess,
  getReusableProcessDetailsById,
  getReusableProcessLogsById,
  getTestStepByReusableProcess,
  saveReusableProcess,
  updateReusableProcess
};
