import { required, minLength, isEmail, isURL } from "./validators";

export const registerRules = {
  name: [
    required("Name is required"),
    minLength(3, "Name must be at least 3 characters"),
  ],
  surname: [
    required("Surname is required"),
    minLength(3, "Surname must be at least 3 characters"),
  ],
  email: [
    required("Email is required"),
    isEmail("Email should be a valid email address"),
  ],
  password: [
    required("Password is required"),
    minLength(6, "Password must be at least 6 characters"),
  ],
  avatar: [
    isURL("Avatar image should be a valid URL"),
  ]
};