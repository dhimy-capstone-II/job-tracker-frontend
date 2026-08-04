// src/components/Layout.jsx

import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout({
  user,
  onLogout,
  authError,
}) {
  return (
    <div className="app">
      <Navbar user={user} onLogout={onLogout} />

      <main className="page-content">
        {authError && (
          <p
            role="alert"
            className="auth-error-message"
          >
            {authError}
          </p>
        )}

        <Outlet />
      </main>

      <Footer />
    </div>
  );
}