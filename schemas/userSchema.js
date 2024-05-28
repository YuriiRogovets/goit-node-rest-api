import Joi from "joi";

export const registerSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string(),
    token: Joi.string(),
});

export const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
});
