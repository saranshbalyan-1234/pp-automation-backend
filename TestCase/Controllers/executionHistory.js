import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import moment from "moment";
import { deleteS3Folder } from "#storage/Service/awsService.js";
import { idValidation } from "#validations/index.js";
import errorContstants from "#constants/error.js";
const ExecutionHistory = db.executionHistory;
const ProcessHistory = db.processHistory;
const TestStepHistory = db.testStepHistory;

const getAllExecutionHistoryByTestCase = async (req, res) => {
    /*  #swagger.tags = ["Execution History"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const testCaseId = req.params.testCaseId;
        const { error } = idValidation.validate({ id: testCaseId });
        if (error) throw new Error(error.details[0].message);

        const executionHistories = await ExecutionHistory.schema(req.database).findAll({
            where: {
                testCaseId,
            },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json(executionHistories);
    } catch (err) {
        getError(err, res);
    }
};

const deleteExecutionHistoryById = async (req, res) => {
    /*  #swagger.tags = ["Execution History"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */

    try {
        const executionHistoryId = req.params.executionHistoryId;
        const { error } = idValidation.validate({ id: executionHistoryId });
        if (error) throw new Error(error.details[0].message);
        const deletedExecutionHistory = await ExecutionHistory.schema(req.database).destroy({
            where: { id: executionHistoryId },
        });

        if (deletedExecutionHistory > 0) {
            deleteS3Folder(req.database.split("_")[1], req.params.executionHistoryId);
            return res.status(200).json({ message: "Execution History deleted successfully" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};
const deleteExecutionHistoryByTestCase = async (req, res) => {
    /*  #swagger.tags = ["Execution History"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const testCaseId = req.params.testCaseId;

        const allHsitory = await ExecutionHistory.schema(req.database).findAll({
            where: { testCaseId },
        });

        const deletedExecutionHistory = await ExecutionHistory.schema(req.database).destroy({
            where: { testCaseId },
        });

        if (deletedExecutionHistory > 0) {
            allHsitory.forEach((el) => {
                deleteS3Folder(req.database.split("_")[1], el.dataValues.id);
            });

            return res.status(200).json({ message: "All Execution History deleted successfully" });
        } else {
            return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
        }
    } catch (err) {
        getError(err, res);
    }
};
const getExecutionHistoryById = async (req, res) => {
    /*  #swagger.tags = ["Execution History"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const executionHistoryId = req.params.executionHistoryId;
        const { error } = idValidation.validate({ id: executionHistoryId });
        if (error) throw new Error(error.details[0].message);

        const executionHistory = await ExecutionHistory.schema(req.database).findByPk(executionHistoryId, {
            include: [
                {
                    model: ProcessHistory.schema(req.database),
                    as: "process",
                    where: { executionHistoryId },
                    include: [
                        {
                            model: TestStepHistory.schema(req.database),
                            as: "testSteps",
                            where: { executionHistoryId: executionHistoryId },
                        },
                    ],
                },
            ],
        });
        let executionTime = "";
        if (executionHistory.dataValues.finishedAt) {
            let startingTime = moment(executionHistory.dataValues.createdAt);
            let timeTaken = moment(executionHistory.dataValues.finishedAt).diff(moment(startingTime), "seconds");
            executionTime = moment.utc(timeTaken * 1000).format("HH:mm:ss");
        }

        return res.status(200).json({ ...executionHistory.dataValues, executionTime });
    } catch (error) {
        getError(error, res);
    }
};

export { getAllExecutionHistoryByTestCase, deleteExecutionHistoryById, getExecutionHistoryById, deleteExecutionHistoryByTestCase };
