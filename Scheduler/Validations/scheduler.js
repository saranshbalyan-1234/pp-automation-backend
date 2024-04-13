import joi from '@hapi/joi';

const createJobManagerValidation = joi.object({
  active: joi.boolean(),
  connection: joi.object().allow(null, ''),
  name: joi.string().min(1).max(10).required()
});

const createJobValidataion = joi.object({
  active: joi.boolean(),
  data: joi.object().allow(null, ''),
  jobManagerId: joi.number().integer().required(),
  name: joi.string().min(1).max(10).required(),
  time: joi.string().required(),
  timezone: joi.string(),
  type: joi.string().required()
});

export { createJobManagerValidation, createJobValidataion };
