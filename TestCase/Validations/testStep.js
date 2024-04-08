import joi from "@hapi/joi";

export const saveTestStepValidation = joi.object({
    processId: joi.number().integer(),
    objectId: joi.number().integer().allow(null),
    reusableProcessId: joi.number().integer(),
    step: joi.number().integer().required(),
    parameters: joi.array().allow(null),
    screenshot: joi.boolean().required(),
    enable: joi.boolean().required(),
    xpath: joi.boolean(),
    comment: joi.string().allow(null, "").required(),
    actionEvent: joi.string().required(),
});

export const updateTestStepValidation = joi.object({
    testStepId: joi.number().integer().required(),
    objectId: joi.number().integer().allow(null),
    parameters: joi.array().allow(null),
    screenshot: joi.boolean().required(),
    enable: joi.boolean().required(),
    xpath: joi.boolean(),
    comment: joi.string().allow(null, "").required(),
    actionEvent: joi.string().required(),
});
