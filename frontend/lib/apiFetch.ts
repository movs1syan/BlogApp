const baseURL = "http://localhost:8000/api";

export const apiFetch = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  params?: Record<string, number | string | string[]>,
  data?: any
) => {
  const url = new URL(`${baseURL}/${endpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isFormData = data instanceof FormData;

  const options: RequestInit = {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
    cache: "no-store",
  };

  const res = await fetch(url, options);

  console.log(options, "res");

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message);
  }

  return res.json();
};
