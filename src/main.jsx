import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import "./index.css";
import App from "./App.jsx";

const authConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
};

const root = createRoot(document.getElementById("root"));

const missing = [
  ["VITE_AUTH0_DOMAIN", authConfig.domain],
  ["VITE_AUTH0_CLIENT_ID", authConfig.clientId],
  [
    "VITE_AUTH0_AUDIENCE",
    authConfig.authorizationParams.audience,
  ],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length > 0) {
  root.render(
    <div className="mx-auto max-w-lg p-8 text-left">
      <h1 className="mb-3 text-2xl font-semibold">
        Missing Auth0 settings
      </h1>

      <p className="mb-4">
        This app can't start until these are set in a{" "}
        <code>.env</code> file:
      </p>

      <ul className="mb-4 list-disc pl-6">
        {missing.map((name) => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
      </ul>

      <p>
        Copy <code>.env.example</code> to <code>.env</code>,
        fill in the values from Auth0, then restart{" "}
        <code>npm run dev</code>.
      </p>
    </div>,
  );
} else {
  root.render(
    <StrictMode>
      <Auth0Provider {...authConfig}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    </StrictMode>,
  );
}