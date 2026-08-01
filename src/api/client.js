// api/client.js — the one place that talks to the backend.
// Every API call goes through request(), so shared logic (base URL, headers,
// error handling) lives in ONE spot instead of being copy-pasted everywhere.

// Where the backend lives. In dev it's your local Express server; in production
// set VITE_API_URL to your deployed backend URL. Vite only exposes vars that
// start with VITE_, and reads them at build time.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send cookies (needed once you add login/auth)
    ...options,
  });

  // fetch only throws on a network failure, so check the HTTP status.
  if (!res.ok) {
    // The backend sends errors as { error: "..." }.
    const body = await res.json().catch(() => ({}));

    throw new Error(body.error || `Request failed (${res.status})`);
  }

  // DELETE can return 204 with no JSON body.
  if (res.status === 204) return null;

  return res.json();
}
