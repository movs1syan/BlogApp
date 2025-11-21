export type RequiredType = (message: string) => (value: string) => string | null;
export type MinLengthType = (length: number, message: string) => (value: string) => string | null;

export const required: RequiredType = (message = "This field is required") => {
  return (value: string) => {
    if (value) {
      return null;
    }

    return message;
  };
};

export const minLength: MinLengthType = (length, message = `Must be at least ${length} characters`) => {
  return (value) => {
    if (value && value.length >= length) {
      return null;
    }

    return message;
  };
};

export const isEmail: RequiredType = (message = "Invalid email") => {
  return (value) => {
    const pattern = /\S+@\S+\.\S+/;
    if (pattern.test(value)) {
      return null;
    }

    return message;
  };
};

export const isURL: RequiredType = (message = "Invalid URL") => {
  return (value) => {
    if (!value) return null;

    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  };
};