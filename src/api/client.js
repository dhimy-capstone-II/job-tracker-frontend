// src/api/client.js
// Shared fetch setup for frontend API requests.

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function request(path, options = {}) {
  const { headers = {}, ...restOptions } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error || `Request failed (${response.status})`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
