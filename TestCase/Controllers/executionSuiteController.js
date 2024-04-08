import errorContstants from "#constants/error.js";
import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import { idValidation } from "#validations/index.js";
import { Op } from "sequelize";
const ExecutionSuite = db.executionSuites;
const CaseExecution = db.testCaseExecutionMappings;
const TestCase = db.testCases;
const Environment = db.enviroments;

const addExecutionSuite = async (req, res) => {
    /*  #swagger.tags = ["Execution Suite"]
     #swagger.security = [{"apiKeyAuth": []}]

  */
    try {
        const executionSuite = await ExecutionSuite.schema(req.database).create({ ...req.body, createdByUser: req.user.id });
        return res.status(200).json(executionSuite);
    } catch (error) {
        getError(error, res);
    }
};

const getAllExecutionSuite = async (req, res) => {
    /*  #swagger.tags = ["Execution Suite"]
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const projectId = req.headers["x-project-id"];

        const executionSuite = await ExecutionSuite.schema(req.database).findAll({
            where: { projectId },
            attributes: ["id", "name", "createdByUser", "tags", "description", "createdAt"],
        });

        return res.status(200).json(executionSuite);
    } catch (error) {
        getError(error, res);
    }
};

const deleteExecutionSuite = async (req, res) => {
    /*  #swagger.tags = ["Execution Suite"]
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const executionSuiteId = req.params.executionSuiteId;
        const { error } = idValidation.validate({ id: executionSuiteId });
        if (error) throw new Error(error.details[0].message);

        const deletedExecutionSuite = await ExecutionSuite.schema(req.database).destroy({
            where: { id: executionSuiteId },
        });
        if (deletedExecutionSuite > 0) return res.status(200).json({ message: "Execution Suite deleted successfully!" });
        else return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
    } catch (error) {
        getError(error, res);
    }
};

const addTestCaseToExecutionSuite = async (req, res) => {
    /*  #swagger.tags = ["Execution Suite"]
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const { testCaseId, executionSuiteId, step } = req.body;

        await CaseExecution.schema(req.database).increment("step", {
            by: 1,
            where: {
                executionSuiteId: { [Op.eq]: executionSuiteId },
                step: {
                    [Op.gte]: step,
                },
            },
        });

        const newMapping = await CaseExecution.schema(req.database).create({ testCaseId, executionSuiteId, step });

        const addedTestCase = await CaseExecution.schema(req.database).findOne({
            where: { id: newMapping.dataValues.id },
            attributes: ["id", "step", "createdAt"],
            include: [
                {
                    model: TestCase.schema(req.database),
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Environment.schema(req.database),
                            as: "environments",
                            attributes: ["id", "name"],
                        },
                    ],
                },
            ],
        });

        return res.status(200).json({ ...addedTestCase.dataValues, message: "Test Case added!" });
    } catch (error) {
        getError(error, res);
    }
};

const removeTestCaseFromExecutionSuite = async (req, res) => {
    /*  #swagger.tags = ["Execution Suite"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const caseExecutionId = req.params.id;

        const deletingCaseExecution = await CaseExecution.schema(req.database).findByPk(caseExecutionId);

        await CaseExecution.schema(req.database).destroy({ where: { id: caseExecutionId } });

        await CaseExecution.schema(req.database).decrement("step", {
            by: 1,
            where: {
                executionSuiteId: { [Op.eq]: deletingCaseExecution.executionSuiteId },
                step: { [Op.gt]: deletingCaseExecution.step },
            },
        });

        return res.status(200).json({ message: "Test Case removed!" });
    } catch (error) {
        getError(error, res);
    }
};

const getTestCaseByExecutionSuiteId = async (req, res) => {
    /*  #swagger.tags = ["Execution Suite"]
      #swagger.security = [{"apiKeyAuth": []}] */
    try {
        const executionSuiteId = req.params.executionSuiteId;
        // const { error } = idValidation.validate({ id: userId });
        // if (error) throw new Error(error.details[0].message);

        const testcases = await CaseExecution.schema(req.database).findAll({
            where: { executionSuiteId },
            attributes: ["id", "step", "createdAt"],
            include: [
                {
                    model: TestCase.schema(req.database),
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Environment.schema(req.database),
                            as: "environments",
                            attributes: ["id", "name"],
                        },
                    ],
                },
            ],
            order: [
                ["step", "ASC"],
                // [TestStep, "step", "ASC"],
                // [ReusableProcess, TestStep, "step", "ASC"],
            ],
        });

        // const updatedArray = testcases.map((el) => {
        //  return { ...el.testCase.dataValues };
        // });

        return res.status(200).json(testcases);
    } catch (error) {
        getError(error, res);
    }
};

const getExecutionSuiteDetailsById = async (req, res) => {
    /*  #swagger.tags = ["Execution Suite"]
      #swagger.security = [{"apiKeyAuth": []}] */

    try {
        const executionSuiteId = req.params.executionSuiteId;
        const { error } = idValidation.validate({
            id: executionSuiteId,
        });
        if (error) throw new Error(error.details[0].message);
        const executionSuite = await ExecutionSuite.schema(req.database).findOne({
            where: {
                id: executionSuiteId,
            },
            attributes: ["id", "name", "createdAt", "updatedAt", "description", "tags", "createdByUser"],
        });
        const totalTestCase = await CaseExecution.schema(req.database).count({
            where: { executionSuiteId },
        });

        return res.status(200).json({ ...executionSuite.dataValues, totalTestCase });
    } catch (err) {
        getError(err, res);
    }
};

const editExecutionSuite = async (req, res) => {
    /*  #swagger.tags = ["Execution Suite"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const executionSuiteId = req.params.executionSuiteId;

        // const { error } = updateProjectValidation.validate({
        //   ...req.body,
        //   projectId,
        // });
        // if (error) throw new Error(error.details[0].message);

        const updatedExecutionSuite = await ExecutionSuite.schema(req.database).update(req.body, {
            where: {
                id: executionSuiteId,
            },
        });

        if (updatedExecutionSuite[0]) {
            return res.status(200).json({ message: "Execution Suite Updated Successfully!" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (error) {
        getError(error, res);
    }
};

export {
    addExecutionSuite,
    getAllExecutionSuite,
    deleteExecutionSuite,
    addTestCaseToExecutionSuite,
    removeTestCaseFromExecutionSuite,
    getTestCaseByExecutionSuiteId,
    getExecutionSuiteDetailsById,
    editExecutionSuite,
};
