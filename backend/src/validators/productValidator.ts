import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': 'Product name must be at least 3 characters long.',
    'string.empty': 'Product name is a required field',
    'any.required': 'Product name is a required field'
  }),
  description: Joi.string().min(8).required().messages({
    'string.min': 'Product description must be at least 8 characters long.',
    'string.empty': 'Product description is a required field',
    'any.required': 'Product description is a required field'
  }),
  price: Joi.number().required().messages({
    'number.empty': 'Product price is a required field',
    'any.required': 'Product price is a required field'
  }),
  image: Joi.string().optional()
});