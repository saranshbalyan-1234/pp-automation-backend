import { Op } from 'sequelize';

import errorContstants from '#constants/error.js';
import db from '#utils/dataBaseConnection.js';
import getError from '#utils/error.js';
import { idValidation } from '#validations/index.js';
const ExecutionSuite = db.executionSuites;
const CaseExecution = db.testCaseExecutionMappings;
const TestCase = db.testCases;
const Environment = db.enviroments;

const addExecutionSuite = async (req, res) => {
  /*
   *  #swagger.tags = ["Execution Suite"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   *
   */
  try {
    const executionSuite = await ExecutionSuite.schema(req.database).create({ ...req.body, createdByUser: req.user.id });
    return res.status(200).json(executionSuite);
  } catch (error) {
    getError(error, res);
  }
};

const getAllExecutionSuite = async (req, res) => {
  /*
   *  #swagger.tags = ["Execution Suite"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const projectId = req.headers['x-project-id'];

    const executionSuite = await ExecutionSuite.schema(req.database).findAll({
      attributes: ['id', 'name', 'createdByUser', 'tags', 'description', 'createdAt'],
      where: { projectId }
    });

    return res.status(200).json(executionSuite);
  } catch (error) {
    getError(error, res);
  }
};

const deleteExecutionSuite = async (req, res) => {
  /*
   *  #swagger.tags = ["Execution Suite"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { executionSuiteId } = req.params;
    const { error } = idValidation.validate({ id: executionSuiteId });
    if (error) throw new Error(error.details[0].message);

    const deletedExecutionSuite = await ExecutionSuite.schema(req.database).destroy({
      where: { id: executionSuiteId }
    });
    if (deletedExecutionSuite > 0) return res.status(200).json({ message: 'Execution Suite deleted successfully!' });
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (error) {
    getError(error, res);
  }
};

const addTestCaseToExecutionSuite = async (req, res) => {
  /*
   *  #swagger.tags = ["Execution Suite"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { testCaseId, executionSuiteId, step } = req.body;

    await CaseExecution.schema(req.database).increment('step', {
      by: 1,
      where: {
        executionSuiteId: { [Op.eq]: executionSuiteId },
        step: {
          [Op.gte]: step
        }
      }
    });

    const newMapping = await CaseExecution.schema(req.database).create({ executionSuiteId, step, testCaseId });

    const addedTestCase = await CaseExecution.schema(req.database).findOne({
      attributes: ['id', 'step', 'createdAt'],
      include: [
        {
          attributes: ['id', 'name'],
          include: [
            {
              as: 'environments',
              attributes: ['id', 'name'],
              model: Environment.schema(req.database)
            }
          ],
          model: TestCase.schema(req.database)
        }
      ],
      where: { id: newMapping.dataValues.id }
    });

    return res.status(200).json({ ...addedTestCase.dataValues, message: 'Test Case added!' });
  } catch (error) {
    getError(error, res);
  }
};

const removeTestCaseFromExecutionSuite = async (req, res) => {
  /*
   *  #swagger.tags = ["Execution Suite"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const caseExecutionId = req.params.id;

    const deletingCaseExecution = await CaseExecution.schema(req.database).findByPk(caseExecutionId);

    await CaseExecution.schema(req.database).destroy({ where: { id: caseExecutionId } });

    await CaseExecution.schema(req.database).decrement('step', {
      by: 1,
      where: {
        executionSuiteId: { [Op.eq]: deletingCaseExecution.executionSuiteId },
        step: { [Op.gt]: deletingCaseExecution.step }
      }
    });

    return res.status(200).json({ message: 'Test Case removed!' });
  } catch (error) {
    getError(error, res);
  }
};

const getTestCaseByExecutionSuiteId = async (req, res) => {
  /*
   *  #swagger.tags = ["Execution Suite"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { executionSuiteId } = req.params;
    /*
     * Const { error } = idValidation.validate({ id: userId });
     * if (error) throw new Error(error.details[0].message);
     */

    const testcases = await CaseExecution.schema(req.database).findAll({
      attributes: ['id', 'step', 'createdAt'],
      include: [
        {
          attributes: ['id', 'name'],
          include: [
            {
              as: 'environments',
              attributes: ['id', 'name'],
              model: Environment.schema(req.database)
            }
          ],
          model: TestCase.schema(req.database)
        }
      ],
      order: [
        ['step', 'ASC']
        /*
         * [TestStep, "step", "ASC"],
         * [ReusableProcess, TestStep, "step", "ASC"],
         */
      ],
      where: { executionSuiteId }
    });

    /*
     * Const updatedArray = testcases.map((el) => {
     *  return { ...el.testCase.dataValues };
     * });
     */

    return res.status(200).json(testcases);
  } catch (error) {
    getError(error, res);
  }
};

const getExecutionSuiteDetailsById = async (req, res) => {
  /*
   *  #swagger.tags = ["Execution Suite"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    const { executionSuiteId } = req.params;
    const { error } = idValidation.validate({
      id: executionSuiteId
    });
    if (error) throw new Error(error.details[0].message);
    const executionSuite = await ExecutionSuite.schema(req.database).findOne({
      attributes: ['id', 'name', 'createdAt', 'updatedAt', 'description', 'tags', 'createdByUser'],
      where: {
        id: executionSuiteId
      }
    });
    const totalTestCase = await CaseExecution.schema(req.database).count({
      where: { executionSuiteId }
    });

    return res.status(200).json({ ...executionSuite.dataValues, totalTestCase });
  } catch (err) {
    getError(err, res);
  }
};

const editExecutionSuite = async (req, res) => {
  /*
   *  #swagger.tags = ["Execution Suite"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { executionSuiteId } = req.params;

    /*
     * Const { error } = updateProjectValidation.validate({
     *   ...req.body,
     *   projectId,
     * });
     * if (error) throw new Error(error.details[0].message);
     */

    const updatedExecutionSuite = await ExecutionSuite.schema(req.database).update(req.body, {
      where: {
        id: executionSuiteId
      }
    });

    if (updatedExecutionSuite[0]) {
      return res.status(200).json({ message: 'Execution Suite Updated Successfully!' });
    }
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (error) {
    getError(error, res);
  }
};

export {
  addExecutionSuite,
  addTestCaseToExecutionSuite,
  deleteExecutionSuite,
  editExecutionSuite,
  getAllExecutionSuite,
  getExecutionSuiteDetailsById,
  getTestCaseByExecutionSuiteId,
  removeTestCaseFromExecutionSuite
};
