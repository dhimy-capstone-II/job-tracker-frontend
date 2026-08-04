// src/api/auth.js — every request related to authentication.
//
// The backend stores the local JWT inside an httpOnly cookie.
// Frontend JavaScript cannot read that cookie, which is intentional.
// `credentials: "include"` tells the browser to send it automatically.
//
// Auth0 is different: its access token comes from the Auth0 React SDK,
// so that token is sent manually in the Authorization header.

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// -----------------------------------------------------------------------------
// Local account authentication
// -----------------------------------------------------------------------------

// POST /auth/signup
// Creates a local account and logs the user in.
//
// credentials should contain:
// {
//   username,
//   email,
//   password
// }
export async function signup(credentials) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error || `Signup failed (${response.status})`,
    );
  }

  return response.json();
}

// POST /auth/login
// Logs in with an email or username and password.
//
// credentials should contain:
// {
//   identifier,
//   password
// }
export async function login(credentials) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error || `Login failed (${response.status})`,
    );
  }

  return response.json();
}

// POST /auth/logout
// Asks the backend to clear the httpOnly JWT cookie.
export async function logoutRequest() {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error || `Logout failed (${response.status})`,
    );
  }

  return response.json();
}

// -----------------------------------------------------------------------------
// Auth0 social authentication
// -----------------------------------------------------------------------------

// POST /auth/auth0
// Creates the Auth0 user in your own users table on the first login,
// or returns the existing user on later logins.
//
// token is the Auth0 access token.
// profile can contain app-specific information such as username.
export async function syncUser(token, profile = {}) {
  const response = await fetch(`${BASE_URL}/auth/auth0`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error ||
        `Could not sync Auth0 user (${response.status})`,
    );
  }

  return response.json();
}

// -----------------------------------------------------------------------------
// Works with either local JWT cookie or Auth0 token
// -----------------------------------------------------------------------------

// GET /auth/me
// Returns the user row from your backend database.
//
// For local accounts:
//   call getMe() with no token.
//
// For Auth0 accounts:
//   call getMe(token).
export async function getMe(token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error || `Not logged in (${response.status})`,
    );
  }

  return response.json();
}

// GET /api/protected
// Optional testing function that confirms authentication works.
export async function getProtected(token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/protected`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error || `Request failed (${response.status})`,
    );
  }

  return response.json();
}