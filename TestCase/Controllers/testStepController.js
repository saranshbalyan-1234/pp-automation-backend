import { Op } from 'sequelize';

import errorContstants from '#constants/error.js';
import { saveTestStepValidation, updateTestStepValidation } from '#testcase/Validations/testStep.js';
import db from '#utils/dataBaseConnection.js';
import getError from '#utils/error.js';
import { idValidation } from '#validations/index.js';
const TestStep = db.testSteps;
const Object = db.objects;
const TestParameter = db.testParameters;

const saveTestStep = async (req, res) => {
  /*
   *  #swagger.tags = ["Test Step"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    await db.sequelize.transaction(async (transaction) => {
      const { processId, reusableProcessId, step } = req.body;

      const permissionName = reusableProcessId ? 'Reusable Process' : 'Test Case';

      if (!req.user.customerAdmin) {
        const allowed = await req.user.permissions.some((permission) => permissionName === permission.name && permission.edit);
        if (!allowed) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
      }

      const { error } = saveTestStepValidation.validate(req.body);
      if (error) throw new Error(error.details[0].message);

      if (processId) {
        await TestStep.schema(req.database).increment('step', {
          by: 1,
          transaction,
          where: {
            processId: { [Op.eq]: processId },
            step: {
              [Op.gte]: step
            }
          }
        });
      } else {
        await TestStep.schema(req.database).increment('step', {
          by: 1,
          transaction,
          where: {
            reusableProcessId: { [Op.eq]: reusableProcessId },
            step: {
              [Op.gte]: step
            }
          }
        });
      }
      const teststep = await TestStep.schema(req.database).create(req.body, { transaction });
      const parameterPayload = req.body.parameters
        .filter((el) => el.property)
        .map((el) => ({ ...el, testStepId: teststep.id }));
      await TestParameter.schema(req.database).bulkCreate(parameterPayload, { transaction });
      const stepData = await TestStep.schema(req.database).findByPk(teststep.id, {
        include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],
        transaction
      });
      return res.status(200).json(stepData);
    });
  } catch (err) {
    getError(err, res);
  }
};

const updateTestStep = async (req, res) => {
  /*
   *  #swagger.tags = ["Test Step"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    await db.sequelize.transaction(async (transaction) => {
      const { testStepId } = req.params;

      const updatingStep = await TestStep.schema(req.database).findByPk(testStepId);

      const permissionName = updatingStep.reusableProcessId ? 'Reusable Process' : 'Test Case';

      if (!req.user.customerAdmin) {
        const allowed = await req.user.permissions.some((permission) => permissionName === permission.name && permission.edit);
        if (!allowed) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
      }

      const { error } = updateTestStepValidation.validate({
        ...req.body,
        testStepId
      });
      if (error) throw new Error(error.details[0].message);

      const updatedTestStep = await TestStep.schema(req.database).update(
        { ...req.body, objectId: req.body.objectId || null },
        {
          transaction,
          where: {
            id: testStepId
          }
        }
      );

      await TestParameter.schema(req.database).destroy({
        transaction,
        where: { testStepId }
      });

      const parameterPayload = req.body.parameters
        .filter((el) => el.property)
        .map((el) => ({ ...el, testStepId }));

      await TestParameter.schema(req.database).bulkCreate(parameterPayload, { transaction });

      if (updatedTestStep[0]) {
        const step = await TestStep.schema(req.database).findByPk(testStepId, {
          include: [{ model: Object.schema(req.database) }, { model: TestParameter.schema(req.database) }],
          transaction
        });

        return res.status(200).json({
          ...step.dataValues,
          message: 'TestStep updated successfully!'
        });
      }
      return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
    });
  } catch (err) {
    getError(err, res);
  }
};

const deleteTestStep = async (req, res) => {
  /*
   *  #swagger.tags = ["Test Step"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */

  try {
    await db.sequelize.transaction(async (transaction) => {
      const { testStepId } = req.params;

      const deletingTestStep = await TestStep.schema(req.database).findByPk(testStepId);

      const permissionName = deletingTestStep.reusableProcessId ? 'Reusable Process' : 'Test Case';

      if (!req.user.customerAdmin) {
        const allowed = await req.user.permissions.some((permission) => permissionName === permission.name && permission.edit);
        if (!allowed) return res.status(401).json({ error: errorContstants.UNAUTHORIZED });
      }

      const { error } = idValidation.validate({ id: testStepId });
      if (error) throw new Error(error.details[0].message);

      const deletedTestStep = await TestStep.schema(req.database).destroy({
        transaction,
        where: { id: testStepId }
      });

      if (deletedTestStep > 0) {
        if (deletingTestStep.processId) {
          await TestStep.schema(req.database).decrement('step', {
            by: 1,
            transaction,
            where: {
              processId: { [Op.eq]: deletingTestStep.processId },
              step: {
                [Op.gt]: deletingTestStep.step
              }
            }
          });
        } else {
          await TestStep.schema(req.database).decrement('step', {
            by: 1,
            transaction,
            where: {
              reusableProcessId: { [Op.eq]: deletingTestStep.reusableProcessId },
              step: {
                [Op.gt]: deletingTestStep.step
              }
            }
          });
        }
        return res.status(200).json({ message: 'TestStep deleted successfully' });
      }
      return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
    });
  } catch (err) {
    getError(err, res);
  }
};

export { deleteTestStep, saveTestStep, updateTestStep };
