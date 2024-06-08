import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
  owner: Joi.string(),

});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});
  
export const updateStatusContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean().required(),
});

export const createUserSchema = Joi.object({
  password: Joi.string().required().min(5),
  email: Joi.string().required(),
  subscription: Joi.string(),
  token: Joi.string(),
});


