import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'string.empty': 'Name is a required field.',
    'any.required': 'Name is a required field.',
  }),
  surname: Joi.string().min(3).required().messages({
    'string.min': 'Surname must be at least 3 characters long.',
    'string.empty': 'Surname is a required field.',
    'any.required': 'Surname is a required field.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email is a required field.',
    'any.required': 'Email is a required field.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.empty': 'Password is a required field.',
    'any.required': 'Password is a required field.',
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    'string.empty': 'Confirm password is a required field.',
    'any.required': 'Confirm password is a required field.',
    'any.only': "Confirm password does not match the password.",
  }),
  avatar: Joi.string().optional(),
});

export const authUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email is a required field.',
    'any.required': 'Email is a required field.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.empty': 'Password is a required field.',
    'any.required': 'Password is a required field.',
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'string.empty': 'Name is a required field.',
    'any.required': 'Name is a required field.',
  }),
  surname: Joi.string().min(3).required().messages({
    'string.min': 'Surname must be at least 3 characters long.',
    'string.empty': 'Surname is a required field.',
    'any.required': 'Surname is a required field.',
  }),
  avatar: Joi.string().optional(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email is a required field.',
    'any.required': 'Email is a required field.',
  })
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.empty': 'Password is a required field.',
    'any.required': 'Password is a required field.',
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    'string.empty': 'Confirm password is a required field.',
    'any.required': 'Confirm password is a required field.',
    'any.only': "Confirm password does not match the password.",
  }),
  token: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.empty': 'Password is a required field.',
    'any.required': 'Password is a required field.',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters long.',
    'string.empty': 'New password is a required field.',
    'any.required': 'New password is a required field.',
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    'string.empty': 'Confirm password is a required field.',
    'any.required': 'Confirm password is a required field.',
    'any.only': "Confirm password does not match the password.",
  }),
});