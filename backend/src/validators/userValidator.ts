import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  surname: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  avatar: Joi.string().uri().optional(),
  password: Joi.string().required(),
});