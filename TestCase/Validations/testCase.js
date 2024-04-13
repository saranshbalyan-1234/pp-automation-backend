import joi from '@hapi/joi';

export const updateTestCaseValidation = joi.object({
  description: joi.string().allow(null, '').required(),
  name: joi.string().min(3).max(100).required(),
  tags: joi.array().allow(null, ''),
  testCaseId: joi.number().integer().required()
});

export const saveProcesValidation = joi.object({
  comment: joi.string().allow(null, '').required(),
  enable: joi.boolean().required(),
  name: joi.string().min(3).max(100).required(),
  reusableProcessId: joi.number().integer(),
  step: joi.number().integer().required(),
  testCaseId: joi.number().integer().required(),
  testSteps: joi.array().allow(null, '')
});

export const updateProcessValidation = joi.object({
  comment: joi.string().allow(null, ''),
  enable: joi.boolean().required(),
  name: joi.string().min(3).max(100),
  processId: joi.number().integer(),
  reusableProcessId: joi.number().integer()
});
