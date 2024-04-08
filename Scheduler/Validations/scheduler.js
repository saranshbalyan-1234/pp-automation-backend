import joi from "@hapi/joi";

const createJobManagerValidation = joi.object({
    name: joi.string().pattern(new RegExp("^[a-zA-Z]*$")).min(1).max(10).required().messages({ "string.pattern.base": "Only characters are allowed." }),
    active: joi.boolean(),
    connection: joi.object().allow(null, ""),
});

const createJobValidataion = joi.object({
    name: joi.string().pattern(new RegExp("^[a-zA-Z]*$")).min(1).max(10).required().messages({ "string.pattern.base": "Only characters are allowed." }),
    jobManagerId: joi.number().integer().required(),
    type: joi.string().required(),
    time: joi.string().required(),
    data: joi.object().allow(null, ""),
    timezone: joi.string(),
    active: joi.boolean(),
});

export { createJobManagerValidation, createJobValidataion };
