import joi from '@hapi/joi';

export const saveTestStepValidation = joi.object({
  actionEvent: joi.string().required(),
  comment: joi.string().allow(null, '').required(),
  enable: joi.boolean().required(),
  objectId: joi.number().integer().allow(null),
  parameters: joi.array().allow(null),
  processId: joi.number().integer(),
  reusableProcessId: joi.number().integer(),
  screenshot: joi.boolean().required(),
  step: joi.number().integer().required(),
  xpath: joi.boolean()
});

export const updateTestStepValidation = joi.object({
  actionEvent: joi.string().required(),
  comment: joi.string().allow(null, '').required(),
  enable: joi.boolean().required(),
  objectId: joi.number().integer().allow(null),
  parameters: joi.array().allow(null),
  screenshot: joi.boolean().required(),
  testStepId: joi.number().integer().required(),
  xpath: joi.boolean()
});
