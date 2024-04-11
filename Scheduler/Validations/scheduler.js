import joi from '@hapi/joi';

const createJobManagerValidation = joi.object({
  name: joi.string().min(1).max(10).required(),
  active: joi.boolean(),
  connection: joi.object().allow(null, '')
});

const createJobValidataion = joi.object({
  name: joi.string().min(1).max(10).required(),
  jobManagerId: joi.number().integer().required(),
  type: joi.string().required(),
  time: joi.string().required(),
  data: joi.object().allow(null, ''),
  timezone: joi.string(),
  active: joi.boolean()
});

export { createJobManagerValidation, createJobValidataion };
