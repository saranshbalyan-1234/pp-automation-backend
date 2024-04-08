import joi from "@hapi/joi";

export const nameValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
});
export const idValidation = joi.object({
    id: joi.number().integer().required(),
});

export const nameDesTagPrjValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
    description: joi.string().allow(null, "").required(),
    tags: joi.array().allow(null, ""),
    projectId: joi.number().integer().required(),
});

export const createLogValidation = joi.object({
    id: joi.number().integer().required(),
    logs: joi.array().required(),
});
