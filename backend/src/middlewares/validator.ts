import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: `Validation failed: ${error.message}` });
    }

    next();
  };
};