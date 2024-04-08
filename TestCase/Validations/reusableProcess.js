import joi from "@hapi/joi";

export const updateReusableProcessValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
    tags: joi.array().allow(null, ""),
    description: joi.string().allow(null, ""),
    reusableProcessId: joi.number().integer().required(),
});
