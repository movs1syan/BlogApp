"use server";

import { cookies } from 'next/headers';

export const getToken = async () => {
  return (await cookies()).get("token")?.value;
};

export const setToken = async (accessToken: string) => {
  (await cookies()).set("token", accessToken, {
    maxAge: 7 * 24 * 3600
  });
};

export const deleteToken = async () => {
  return (await cookies()).delete("token");
};