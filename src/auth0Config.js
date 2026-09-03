// src/auth0Config.js — one place that answers "is social login available?"
//
// Auth0 is an OPTIONAL extra in this project. The app's own email + password
// login is the primary path and works on its own. Anyone can clone the repo and
// run it without creating an Auth0 account; the "Continue with Auth0" buttons
// simply do not appear.
//
// Keeping the check here means main.jsx, LoginPage and SignupPage all read the
// same answer instead of each testing the environment variables themselves.

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
};

// All three values are needed. A partly filled .env would let Auth0 load and
// then fail confusingly at login time, so treat that the same as "off".
export const AUTH0_ENABLED = Boolean(
  auth0Config.domain &&
    auth0Config.clientId &&
    auth0Config.authorizationParams.audience,
);
