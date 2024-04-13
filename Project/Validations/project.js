import joi from '@hapi/joi';

const addProjectValidation = joi.object({
  description: joi.string().allow(null, '').required(),
  endDate: joi.string().required(),
  name: joi.string().min(3).max(100).required(),
  startDate: joi.string().required()
});
const updateProjectValidation = joi.object({
  description: joi.string().allow(null, '').required(),
  endDate: joi.string(),
  name: joi.string().min(3).max(100),
  projectId: joi.number().integer().required(),
  startDate: joi.string()
});

const memberProjectValidation = joi.object({
  projectId: joi.number().integer().required(),
  userId: joi.number().integer().required()
});

export { addProjectValidation, memberProjectValidation, updateProjectValidation };
