import Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  subtitle: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).required(),
  category: Joi.string().required(),
  image: Joi.string().uri().valid("").optional(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(50),
  subtitle: Joi.string().min(3).max(50),
  description: Joi.string().min(3),
  category: Joi.string(),
  image: Joi.string().uri().valid(""),
});