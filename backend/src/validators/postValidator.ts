import Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  subtitle: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).required(),
  category: Joi.string().required(),
  postImage: Joi.string().uri().optional(),
  authorName: Joi.string().required(),
  authorSurname: Joi.string().required(),
  authorImage: Joi.string().uri().optional()
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(50),
  subtitle: Joi.string().min(3).max(50),
  description: Joi.string().min(3),
  category: Joi.string(),
  postImage: Joi.string().uri(),
  authorName: Joi.string(),
  authorSurname: Joi.string(),
  authorImage: Joi.string().uri()
});