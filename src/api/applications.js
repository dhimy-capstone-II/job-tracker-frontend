// api/applications.js — every request for the job applications resource.
// This file keeps all application API calls in one place.

import { request } from "./client";

export function getApplications() {
  return request("/api/applications");
}

export function getApplication(id) {
  return request(`/api/applications/${id}`);
}

export function createApplication(data) {
  return request("/api/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateApplication(id, data) {
  return request(`/api/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteApplication(id) {
  return request(`/api/applications/${id}`, {
    method: "DELETE",
  });
}