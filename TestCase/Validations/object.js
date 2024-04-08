import joi from "@hapi/joi";

export const updateObjectValidation = joi.object({
    name: joi.string().min(3).max(100).required(),
    tags: joi.array().allow(null, ""),
    description: joi.string().allow(null, "").required(),
    objectId: joi.number().integer().required(),
});

export const saveObjectLocatorValidation = joi.object({
    locator: joi.string().required(),
    type: joi.string().required(),
    objectId: joi.number().integer().required(),
});
