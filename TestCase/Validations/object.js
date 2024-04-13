import joi from '@hapi/joi';

export const updateObjectValidation = joi.object({
  description: joi.string().allow(null, '').required(),
  name: joi.string().min(3).max(100).required(),
  objectId: joi.number().integer().required(),
  tags: joi.array().allow(null, '')
});

export const saveObjectLocatorValidation = joi.object({
  locator: joi.string().required(),
  objectId: joi.number().integer().required(),
  type: joi.string().required()
});
