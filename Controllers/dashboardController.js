import { Op, Sequelize } from 'sequelize';

import db from '#utils/dataBaseConnection.js';
import getError from '#utils/error.js';
const User = db.users;
const TestCase = db.testCases;
const ReusableProcess = db.reusableProcess;
const Objects = db.objects;
const UserProject = db.userProjects;
const Project = db.projects;
const ExecutionHistory = db.executionHistory;
export const dashboard = async (req, res) => {
  /*
   *  #swagger.tags = ["Dashboard"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const user = await User.schema(req.database).findAll();

    // Users Start
    const Active = user.filter((el) => el.active === true).length;

    const Unverified = user.filter((el) => el.verifiedAt === null).length;
    const Inactive = user.length - Active - Unverified;

    // Users End

    const userProject = await UserProject.schema(req.database).count({
      where: { userId: req.user.id }
    });

    const executionHistoryCount = await ExecutionHistory.schema(req.database).count({
      where: { executedByUser: req.user.id }
    });
    return res.status(200).json({
      executionHistoryCount,
      project: userProject,
      user: { Active, Inactive, Unverified, total: user.length }
    });
  } catch (error) {
    getError(error, res);
  }
};

export const createdReport = async (req, res) => {
  /*
   *  #swagger.tags = ["Dashboard"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const reusableProcess = await ReusableProcess.schema(req.database).count({
      where: { createdByUser: req.body.userId }
    });
    const object = await Objects.schema(req.database).count({
      where: { createdByUser: req.body.userId }
    });

    const projects = await Project.schema(req.database).count({
      where: { createdByUser: req.body.userId }
    });
    const testCase = await TestCase.schema(req.database).count({
      where: { createdByUser: req.body.userId }
    });

    return res.status(200).json({
      Object: object,
      Projects: projects,
      Reusable: reusableProcess,
      TestCase: testCase
    });
  } catch (error) {
    getError(error, res);
  }
};

export const executionReport = async (req, res) => {
  /*
   *  #swagger.tags = ["Dashboard"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const totalHistory = await ExecutionHistory.schema(req.database).findAll({
      where: req.body
    });

    const incompleteHistory = totalHistory.filter((el) => el.dataValues.finishedAt === null);

    const passedHistory = totalHistory.filter((el) => el.dataValues.result === true);
    const failedHistory = totalHistory.length - passedHistory.length - incompleteHistory.length;
    return res.status(200).json({
      Failed: failedHistory,
      Incomplete: incompleteHistory.length,
      Passed: passedHistory.length,
      Total: totalHistory.length
    });
  } catch (error) {
    getError(error, res);
  }
};

export const detailedExecutionReport = async (req, res) => {
  /*
   *  #swagger.tags = ["Dashboard"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const payload = {};
    if (req.body.executedByUser) {
      payload.executedByUser = req.body.executedByUser;
    }
    if (req.body.testCaseId) {
      payload.testCaseId = req.body.testCaseId;
    }
    if (req.body.startDate && endDate) {
      payload.createdAt = { [Op.between]: [startDate, endDate] };
    }

    const passedHistory = await ExecutionHistory.schema(req.database).count({
      attributes: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'Date']],
      group: [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'Date'],
      where: { ...payload, result: true }
    });
    const failedHistory = await ExecutionHistory.schema(req.database).count({
      attributes: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'Date']],
      group: [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'Date'],
      where: { ...payload, result: false }
    });
    const incompleteHistory = await ExecutionHistory.schema(req.database).count({
      attributes: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'Date']],
      group: [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'Date'],
      where: { ...payload, result: null }
    });
    const totalCount = await ExecutionHistory.schema(req.database).count({
      where: { executedByUser: req.body.executedByUser || req.user.id }
    });
    const data = {};

    passedHistory.forEach((el) => {
      data[el.Date] = {
        ...data[el.Date],
        Passed: { ...data }[el.Date]?.Passed || 0 + el.count
      };
    });
    failedHistory.forEach((el) => {
      data[el.Date] = {
        ...data[el.Date],
        Failed: { ...data }[el.Date]?.Failed || 0 + el.count
      };
    });
    incompleteHistory.forEach((el) => {
      data[el.Date] = {
        ...data[el.Date],
        Incomplete: { ...data }[el.Date]?.Incomplete || 0 + el.count
      };
    });
    const finalData = [];
    Object.entries(data).forEach((el) => {
      finalData.push({ date: el[0], type: 'Passed', value: el[1].Passed || 0 });
      finalData.push({
        date: el[0],
        type: 'Failed',
        value: el[1].Failed || 0
      });
      finalData.push({
        date: el[0],
        type: 'Incomplete',
        value: el[1].Incomplete || 0
      });
      finalData.push({
        date: el[0],
        type: 'Total',
        value: (el[1].Incomplete || 0) + (el[1].Failed || 0) + (el[1].Passed || 0)
      });
    });
    return res.status(200).json({ data: finalData, totalCount });
  } catch (error) {
    getError(error, res);
  }
};
