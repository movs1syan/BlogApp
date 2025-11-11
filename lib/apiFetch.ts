import type { PostType } from "@/shared/types";

const baseURL = "https://6910d3327686c0e9c20bce81.mockapi.io/blog";

export const apiFetch = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  params?: Record<string, number | string>,
  data?: Omit<PostType, "id">
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
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
};
