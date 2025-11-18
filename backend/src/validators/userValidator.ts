import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  surname: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});