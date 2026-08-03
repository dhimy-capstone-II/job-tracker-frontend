// src/api/applications.js — every call for the "job applications" resource.
//
// This follows the same pattern as the instructor's tasks.js.
// Each function contains its own fetch call, error handling,
// and return value.

// In development this is your local Express server.
// In production, VITE_API_URL should point to your deployed backend.
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// -----------------------------------------------------------------------------
// READ ALL — GET /api/applications
// -----------------------------------------------------------------------------

export async function getApplications() {
  const response = await fetch(`${BASE_URL}/api/applications`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error ||
        `Could not load applications (${response.status})`,
    );
  }

  return response.json();
}

// -----------------------------------------------------------------------------
// READ ONE — GET /api/applications/:id
// -----------------------------------------------------------------------------

export async function getApplication(id) {
  const response = await fetch(
    `${BASE_URL}/api/applications/${id}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error ||
        `Could not load application ${id} (${response.status})`,
    );
  }

  return response.json();
}

// -----------------------------------------------------------------------------
// CREATE — POST /api/applications
// -----------------------------------------------------------------------------

export async function createApplication(data) {
  const response = await fetch(
    `${BASE_URL}/api/applications`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error ||
        `Could not create application (${response.status})`,
    );
  }

  return response.json();
}

// -----------------------------------------------------------------------------
// UPDATE — PATCH /api/applications/:id
// -----------------------------------------------------------------------------

export async function updateApplication(id, data) {
  const response = await fetch(
    `${BASE_URL}/api/applications/${id}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error ||
        `Could not update application ${id} (${response.status})`,
    );
  }

  return response.json();
}

// -----------------------------------------------------------------------------
// DELETE — DELETE /api/applications/:id
// -----------------------------------------------------------------------------

export async function deleteApplication(id) {
  const response = await fetch(
    `${BASE_URL}/api/applications/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(
      body.error ||
        `Could not delete application ${id} (${response.status})`,
    );
  }

  // DELETE returns 204 No Content.
  return null;
}