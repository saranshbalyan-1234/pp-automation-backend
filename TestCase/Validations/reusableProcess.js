import joi from '@hapi/joi';

export const updateReusableProcessValidation = joi.object({
  description: joi.string().allow(null, ''),
  name: joi.string().min(3).max(100).required(),
  reusableProcessId: joi.number().integer().required(),
  tags: joi.array().allow(null, '')
});
