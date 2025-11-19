import type {PostType} from "@/shared/types";

const baseURL = "http://localhost:8000/api";

export const apiFetch = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  params?: Record<string, number | string | string[]>,
  data?: Omit<PostType, "id" | "createdAt" | "updatedAt" | "author" | "userId"> | { email: string; password: string }
) => {
  const url = new URL(`${baseURL}/${endpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
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
