import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import { idValidation, createLogValidation } from "#validations/index.js";
import { updateTestCaseValidation, saveProcesValidation, updateProcessValidation } from "#testcase/Validations/testCase.js";
import { nameDesTagPrjValidation } from "#validations/index.js";
import { Op } from "sequelize";
import _ from "lodash";
import errorContstants from "#constants/error.js";
const TestCase = db.testCases;
const Process = db.process;
const Object = db.objects;
const TestParameter = db.testParameters;
const TestStep = db.testSteps;
const ReusableProcess = db.reusableProcess;
const TestCaseLog = db.testCaseLogs;
const saveTestCase = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const { error } = nameDesTagPrjValidation.validate(req.body);
        if (error) throw new Error(error.details[0].message);
        const payload = { ...req.body };
        payload.createdByUser = req.user.id;
        const data = await TestCase.schema(req.database).create(payload);

        createTestCaseLog(req, res, data.id, [`created the TestCase "${req.body.name}".`]);

        return res.status(200).json({ ...data.dataValues, message: "TestCase created successfully!" });
    } catch (err) {
        getError(err, res);
    }
};

const updateTestCase = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        // const { name, tags } = req.body;
        const testCaseId = req.params.testCaseId;
        const { error } = updateTestCaseValidation.validate({
            ...req.body,
            testCaseId,
        });
        if (error) throw new Error(error.details[0].message);

        const updatedTestCase = await TestCase.schema(req.database).update(req.body, {
            where: {
                id: testCaseId,
            },
        });

        if (updatedTestCase[0]) {
            return res.status(200).json({ message: "TestCase updated successfully!" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

const getAllTestCase = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const projectId = req.headers["x-project-id"];
        const { error } = idValidation.validate({ id: projectId });
        if (error) throw new Error(error.details[0].message);

        const testCases = await TestCase.schema(req.database).findAll({
            where: {
                projectId,
            },
            attributes: ["id", "name", "updatedAt", "createdAt", "tags", "createdByUser"],
        });

        return res.status(200).json(testCases);
    } catch (err) {
        getError(err, res);
    }
};

const deleteTestCase = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const testCaseId = req.params.testCaseId;
        const { error } = idValidation.validate({ id: testCaseId });
        if (error) throw new Error(error.details[0].message);

        const deletedTestCase = await TestCase.schema(req.database).destroy({
            where: { id: testCaseId },
        });

        if (deletedTestCase > 0) {
            return res.status(200).json({ message: "TestCase deleted successfully" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};
const getTestCaseDetailsById = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const testCaseId = req.params.testCaseId;

        const { error } = idValidation.validate({ id: testCaseId });
        if (error) throw new Error(error.details[0].message);

        const testCase = await TestCase.schema(req.database).findOne({
            where: {
                id: testCaseId,
            },
            attributes: ["id", "name", "createdAt", "updatedAt", "description", "tags", "createdByUser"],
        });

        const totalProcess = await Process.schema(req.database).findAll({
            where: { testCaseId },
        });
        const processCount = await Process.schema(req.database).count({
            where: { testCaseId, reusableProcessId: null },
        });
        const reusableProcessCount = totalProcess.length - processCount;

        const allStepId = await totalProcess.map((el) => {
            return el.id;
        });
        const allReusableProcessId = await totalProcess.map((el) => {
            return el.reusableProcessId;
        });
        const stepCount = await TestStep.schema(req.database).count({
            where: {
                [Op.or]: [{ processId: allStepId }, { reusableProcessId: allReusableProcessId }],
            },
        });
        return res.status(200).json({
            ...testCase.dataValues,
            reusableProcessCount,
            totalProcess: totalProcess.length,
            stepCount,
        });
    } catch (err) {
        getError(err, res);
    }
};

const getTestStepByTestCase = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        // const { error } = nameValidation.validate(req.body);
        // if (error) throw new Error(error.details[0].message);

        const testCaseId = req.params.testCaseId;
        const { error } = idValidation.validate({ id: testCaseId });
        if (error) throw new Error(error.details[0].message);

        const data = await Process.schema(req.database).findAll({
            where: { testCaseId },
            include: [
                {
                    model: TestStep.schema(req.database),
                    include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],
                },
                {
                    model: ReusableProcess.schema(req.database),
                    include: [
                        {
                            model: TestStep.schema(req.database),
                            include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],
                        },
                    ],
                },
            ],
            order: [
                ["step", "ASC"],
                [TestStep, "step", "ASC"],
                [ReusableProcess, TestStep, "step", "ASC"],
            ],
        });

        const updatedTestCase = data.map((process) => {
            let temp = { ...process.dataValues };

            if (temp.reusableProcess != null) {
                temp.testSteps = temp.reusableProcess.dataValues.testSteps;
                delete temp.reusableProcess.dataValues.testSteps;
            }
            return temp;
        });
        return res.status(200).json(updatedTestCase);
    } catch (err) {
        getError(err, res);
    }
};

const saveProcess = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const { error } = saveProcesValidation.validate(req.body);
        if (error) throw new Error(error.details[0].message);

        const { testCaseId, step } = req.body;

        await Process.schema(req.database).increment("step", {
            by: 1,
            where: {
                testCaseId: { [Op.eq]: testCaseId },
                step: {
                    [Op.gte]: step,
                },
            },
        });

        const data = await Process.schema(req.database).create(req.body, {
            include: [
                {
                    model: TestStep.schema(req.database),
                    include: [{ model: TestParameter.schema(req.database) }],
                },
            ],
        });
        const process = await Process.schema(req.database).findByPk(data.id, {
            include: [
                {
                    model: TestStep.schema(req.database),
                    include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],
                },
                {
                    model: ReusableProcess.schema(req.database),
                    include: [
                        {
                            model: TestStep.schema(req.database),
                            include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],
                        },
                    ],
                },
            ],
        });

        const temp = _.cloneDeep(process);

        if (temp.dataValues.reusableProcess) {
            temp.dataValues.testSteps = temp.dataValues.reusableProcess.dataValues.testSteps;
            delete temp.reusableProcess.dataValues.testSteps;
        }

        return res.status(200).json(temp);
    } catch (err) {
        getError(err, res);
    }
};

const updateProcess = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const processId = req.params.processId;
        const { error } = updateProcessValidation.validate({
            ...req.body,
            processId,
        });
        if (error) throw new Error(error.details[0].message);

        const updatedProcess = await Process.schema(req.database).update(req.body, {
            where: {
                id: processId,
            },
        });

        if (updatedProcess[0]) {
            const process = await Process.schema(req.database).findByPk(processId, {
                include: [
                    {
                        model: ReusableProcess.schema(req.database),
                        include: [
                            {
                                model: TestStep.schema(req.database),
                                include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],
                            },
                        ],
                    },
                ],
            });

            const temp = _.cloneDeep(process);

            if (temp.dataValues.reusableProcess) {
                temp.dataValues.testSteps = temp.dataValues.reusableProcess.dataValues.testSteps;
                delete temp.reusableProcess.dataValues.testSteps;
            } else {
                delete temp.dataValues.testSteps;
            }
            return res.status(200).json({ ...temp.dataValues, message: "Process Updated" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

const deleteProcess = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const processId = req.params.processId;

        const { error } = idValidation.validate({ id: processId });
        if (error) throw new Error(error.details[0].message);

        const deletingProcess = await Process.schema(req.database).findByPk(processId);

        const deletedProcess = await Process.schema(req.database).destroy({
            where: { id: processId },
        });

        if (deletedProcess > 0) {
            await Process.schema(req.database).decrement("step", {
                by: 1,
                where: {
                    testCaseId: { [Op.eq]: deletingProcess.testCaseId },
                    step: {
                        [Op.gt]: deletingProcess.step,
                    },
                },
            });

            return res.status(200).json({ message: "Process deleted successfully" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};

const getTestCaseLogsById = async (req, res) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const testCaseId = req.params.testCaseId;

        const { error } = idValidation.validate({ id: testCaseId });
        if (error) throw new Error(error.details[0].message);

        const locators = await TestCaseLog.schema(req.database).findAll({
            where: {
                testCaseId,
            },
            attributes: ["id", "log", "createdAt", "createdByUser"],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json(locators);
    } catch (err) {
        getError(err, res);
    }
};

const createTestCaseLog = async (req, res, id, logs = []) => {
    /*  #swagger.tags = ["Test Case"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        if (process.env.SAVE_LOGS !== "true") {
            if (logs.length == 0) return res.status(200).json("Logs Off");
            return;
        }

        const testCaseId = req.params.testCaseId || id;
        const tempLogs = req.body.logs || logs;

        const { error } = createLogValidation.validate({
            id: testCaseId,
            logs: tempLogs,
        });
        if (error) throw new Error(error.details[0].message);
        const payload = tempLogs.map((el) => {
            return { log: el, testCaseId, createdByUser: req.user.id };
        });
        await TestCaseLog.schema(req.database).bulkCreate(payload);
        if (logs.length == 0) return res.status(201).json("Log Created");
    } catch (err) {
        if (logs.length == 0) getError(err, res);
        else console.error(err);
    }
};

export {
    saveTestCase,
    updateTestCase,
    getAllTestCase,
    deleteTestCase,
    getTestCaseDetailsById,
    getTestStepByTestCase,
    saveProcess,
    updateProcess,
    deleteProcess,
    getTestCaseLogsById,
    createTestCaseLog,
};
