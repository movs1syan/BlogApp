"use server"

import { apiFetch } from "@/lib/apiFetch";
import {deleteToken, setToken} from "@/lib/cookies";

export const handleRegister = async (userData: FormData) => {
  const data = await apiFetch("POST", "users/register", undefined, userData);
  await setToken(data.token);
};

export const handleLogin = async (userData: {
  email: string
  password: string
}) => {
  const data = await apiFetch("POST", "users/login", undefined, userData);
  await setToken(data.token);
};

export const handleLogoutFn = async () => {
  await deleteToken();
};