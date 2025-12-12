"use server";

import {getToken} from "@/lib/cookies";
import {apiFetch} from "@/lib/apiFetch";

const apiFetchAuth = async (...args) => {
  const token = await getToken();

  if (!token) return null;

  return await apiFetch(...args);
};

export default apiFetchAuth;