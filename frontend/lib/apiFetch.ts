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

      // ❗ ONLY set JSON header if NOT FormData
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
    cache: "no-store",
  };

  const res = await fetch(url, options);

  // If response is NOT JSON (HTML error), throw readable message
  const text = await res.text();
  try {
    const json = JSON.parse(text);

    if (!res.ok) throw new Error(json.message);
    return json;
  } catch {
    console.error("Server returned non-JSON:");
    console.error(text);
    throw new Error("Server returned HTML instead of JSON. (FormData error?)");
  }
};
