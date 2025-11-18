import type {PostType, UserType} from "@/shared/types";

const baseURL = "http://localhost:8000/api";

export const apiFetch = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  params?: Record<string, number | string | string[]>,
  data?: Omit<PostType, "id" | "createdAt"> | Omit<UserType, "id" | "name" | "surname">
) => {
  const url = new URL(`${baseURL}/${endpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "POST" || method === "PUT") {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, {
    ...options,
    cache: "no-store"
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message);
  }

  return res.json();
};
