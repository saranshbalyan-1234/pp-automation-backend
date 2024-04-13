import joi from '@hapi/joi';

export const nameValidation = joi.object({
  name: joi.string().min(3).max(100).required()
});
export const idValidation = joi.object({
  id: joi.number().integer().required()
});

export const nameDesTagPrjValidation = joi.object({
  description: joi.string().allow(null, '').required(),
  name: joi.string().min(3).max(100).required(),
  projectId: joi.number().integer().required(),
  tags: joi.array().allow(null, '')
});

export const createLogValidation = joi.object({
  id: joi.number().integer().required(),
  logs: joi.array().required()
});
