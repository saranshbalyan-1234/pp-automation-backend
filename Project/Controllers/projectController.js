import errorContstants from '#constants/error.constant.js';
import db from '#utils/dataBaseConnection.js';
import getError from '#utils/error.js';
import { idValidation } from '#validations/index.js';

import { addProjectValidation, memberProjectValidation, updateProjectValidation } from '../Validations/project.js';

const UserProject = db.userProjects;
const Project = db.projects;
const User = db.users;
const getMyProject = async (req, res) => {
  /*
   *  #swagger.tags = ["Project"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const userId = req.user.id;
    const { error } = idValidation.validate({ id: userId });
    if (error) throw new Error(error.details[0].message);

    const projects = await UserProject.schema(req.database).findAll({
      include: [
        {
          include: [
            {
              as: 'members',
              include: [
                {
                  attributes: ['id', 'name', 'email', 'active', 'profileImage', 'deletedAt'],
                  model: User.schema(req.database)
                }
              ],
              model: UserProject.schema(req.database)
            }
          ],
          model: Project.schema(req.database)
        }
      ],
      where: { userId }
    });

    const updatedArray = projects.map((el) => {
      const temp = { ...el.project.dataValues };
      temp.members = temp.members.map((el1) => el1.user);
      return temp;
    });

    return res.status(200).json(updatedArray);
  } catch (error) {
    getError(error, res);
  }
};

const getProjectById = async (req, res) => {
  /*
   *  #swagger.tags = ["Project"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { projectId } = req.params;
    const project = await Project.schema(req.database).findByPk(projectId, {
      attributes: ['id', 'name', 'description', 'startDate', 'endDate', 'createdAt', 'createdByUser'],
      include: [
        {
          as: 'members',
          include: [
            {
              attributes: ['id', 'name', 'email', 'active', 'verifiedAt', 'deletedAt'],
              model: User.schema(req.database)
            }
          ],
          model: UserProject.schema(req.database)
        }
      ]
    });

    const temp = { ...project.dataValues };

    temp.members = temp.members.map((user) => user.dataValues.user);

    return res.status(200).json({ ...temp });
  } catch (error) {
    getError(error, res);
  }
};

const addProject = async (req, res) => {
  /*
   *  #swagger.tags = ["Project"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { name, description, startDate, endDate } = req.body;

    const { error } = addProjectValidation.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const project = await Project.schema(req.database).create({
      createdByUser: req.user.id,
      description,
      endDate,
      name,
      startDate
    });

    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await UserProject.schema(req.database).create({
      projectId: project.id,
      userId: req.user.id
    });

    return res.status(200).json(project);
  } catch (error) {
    getError(error, res);
  }
};

const deleteProject = async (req, res) => {
  /*
   *  #swagger.tags = ["Project"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { projectId } = req.params;
    const hProjectId = req.headers['x-project-id'];

    if (projectId === hProjectId) throw new Error('Cannot delete current project');
    await User.schema(req.database).update(
      { defaultProjectId: null },
      {
        where: {
          defaultProjectId: projectId
        }
      }
    );
    await UserProject.schema(req.database).destroy({ where: { projectId } });
    const deletedProject = await Project.schema(req.database).destroy({
      where: { id: projectId }
    });
    if (deletedProject > 0) return res.status(200).json({ message: 'Project deleted successfully!' });
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (error) {
    getError(error, res);
  }
};

const addMember = async (req, res) => {
  /*
   *  #swagger.tags = ["Project"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { projectId, userId } = req.body;
    const { error } = memberProjectValidation.validate({ projectId, userId });
    if (error) throw new Error(error.details[0].message);
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await UserProject.schema(req.database).create({
      projectId,
      userId
    });
    return res.status(200).json({ message: 'Project member added!' });
  } catch (error) {
    getError(error, res);
  }
};

const deleteMember = async (req, res) => {
  /*
   *  #swagger.tags = ["Project"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const { projectId, userId } = req.body;

    const { error } = memberProjectValidation.validate({
      projectId,
      userId
    });
    if (error) throw new Error(error.details[0].message);

    await User.schema(req.database).update(
      { defaultProjectId: null },
      {
        where: {
          defaultProjectId: projectId,
          id: userId
        }
      }
    );
    await UserProject.schema(req.database).destroy({
      where: { projectId, userId }
    });

    return res.status(200).json({ message: 'Project member removed!' });
  } catch (error) {
    getError(error, res);
  }
};

const editProject = async (req, res) => {
  /*
   *  #swagger.tags = ["Project"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  try {
    const projectId = req.headers['x-project-id'];

    const { error } = updateProjectValidation.validate({
      ...req.body,
      projectId
    });
    if (error) throw new Error(error.details[0].message);

    const updatedProject = await Project.schema(req.database).update(req.body, {
      where: {
        id: projectId
      }
    });

    if (updatedProject[0]) {
      return res.status(200).json({ message: 'Project Updated Successfully!' });
    }
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (error) {
    getError(error, res);
  }
};

export { addMember, addProject, deleteMember, deleteProject, editProject, getMyProject, getProjectById };
