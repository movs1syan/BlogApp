import Joi from 'joi';

export const postSchema = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Title must be at least 3 characters long.',
    'string.max': 'Title must be maximum 50 characters long.',
    'string.empty': 'Title is a required field.',
    'any.required': 'Title is a required field.',
  }),
  subtitle: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Subtitle must be at least 3 characters long.',
    'string.max': 'Subtitle must be maximum 50 characters long.',
    'string.empty': 'Subtitle is a required field.',
    'any.required': 'Subtitle is a required field.',
  }),
  description: Joi.string().min(3).required().messages({
    'string.min': 'Description must be at least 3 characters long.',
    'string.empty': 'Description is a required field.',
    'any.required': 'Description is a required field.',
  }),
  category: Joi.string().max(20).required().messages({
    'string.max': 'Category must be maximum 20 characters long.',
    'string.empty': 'Category is a required field.',
    'any.required': 'Category is a required field.',
  }),
  image: Joi.string().optional(),
});