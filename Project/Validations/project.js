import joi from "@hapi/joi";

const addProjectValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
    description: joi.string().allow(null, "").required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
});
const updateProjectValidation = joi.object({
    name: joi.string().min(3).max(100),
    description: joi.string().allow(null, "").required(),
    startDate: joi.string(),
    endDate: joi.string(),
    projectId: joi.number().integer().required(),
});

const memberProjectValidation = joi.object({
    projectId: joi.number().integer().required(),
    userId: joi.number().integer().required(),
});

export { addProjectValidation, memberProjectValidation, updateProjectValidation };
