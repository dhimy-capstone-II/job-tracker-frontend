// api/analytics.js — every request for the dashboard statistics.
// This file keeps all analytics API calls in one place.

import { request } from "./client";

// days is optional. When given, it controls how many days the
// "applications over time" chart covers. The backend falls back to 30
// and clamps anything unreasonable, so this is only a hint.
export function getAnalyticsSummary(days) {
  const query = days ? `?days=${days}` : "";

  return request(`/api/analytics/summary${query}`);
}
