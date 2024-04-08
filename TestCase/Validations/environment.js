import joi from "@hapi/joi";

export const nameTestCaseId = joi.object({
    name: joi.string().min(3).max(100).required(),
    testCaseId: joi.number().integer().required(),
});
export const updateColumnValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
    value: joi.string(),
    envId: joi.number().integer().required(),
});
