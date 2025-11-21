import type { UserType } from "@/shared/types";

const validateForm = (data: Omit<UserType, "id">, rules) => {
  const errors: Record<string, string> = {};

  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }

  return errors;
};

export default validateForm;