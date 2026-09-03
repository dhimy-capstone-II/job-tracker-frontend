import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import "./index.css";
import App from "./App.jsx";
import { AUTH0_ENABLED, auth0Config } from "./auth0Config.js";

// The app used to refuse to render at all when the Auth0 variables were
// missing, which meant a fresh clone showed only an error screen even though
// email + password login worked perfectly. Now Auth0 is treated as optional:
// the provider is only added when it is configured, and the rest of the app
// runs either way.
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

createRoot(document.getElementById("root")).render(
  AUTH0_ENABLED ? (
    <Auth0Provider {...auth0Config}>{app}</Auth0Provider>
  ) : (
    app
  ),
);
