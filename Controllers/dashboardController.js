// import db from '#utils/dataBaseConnection.js';
import getError from '#utils/error.js';
const User = db.users;
const UserProject = db.userProjects;
const Project = db.projects;
const ExecutionHistory = db.executionHistory;
const db = {}
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
    const projects = await Project.schema(req.database).count({
      where: { createdByUser: req.body.userId }
    });

    return res.status(200).json({
      Projects: projects
    });
  } catch (error) {
    getError(error, res);
  }
};
