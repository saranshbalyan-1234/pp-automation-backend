import joi from "@hapi/joi";

export const updateTestCaseValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
    tags: joi.array().allow(null, ""),
    description: joi.string().allow(null, "").required(),
    testCaseId: joi.number().integer().required(),
});

export const saveProcesValidation = joi.object({
    step: joi.number().integer().required(),
    name: joi.string().min(3).max(100).required(),
    comment: joi.string().allow(null, "").required(),
    testCaseId: joi.number().integer().required(),
    reusableProcessId: joi.number().integer(),
    enable: joi.boolean().required(),
    testSteps: joi.array().allow(null, ""),
});

export const updateProcessValidation = joi.object({
    name: joi.string().min(3).max(100),
    comment: joi.string().allow(null, ""),
    processId: joi.number().integer(),
    reusableProcessId: joi.number().integer(),
    enable: joi.boolean().required(),
});
