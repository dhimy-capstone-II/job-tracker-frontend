// src/components/Navbar.jsx
// Shared navigation for logged-in and logged-out users.

import { NavLink } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="site-header">
      <nav className="navbar">
        <NavLink to="/" className="nav-brand">
          <span className="nav-brand-title">
            Job Application Tracker
          </span>

          <span className="nav-brand-subtitle">
            Organize your job search
          </span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          {user && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}

          {user && (
            <NavLink to="/interview-room" className={linkClass}>
              Interview Room
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/applications/new"
              className={linkClass}
            >
              New Application
            </NavLink>
          )}

          {user ? (
            <>
              <span className="nav-user">
                Signed in as{" "}
                <strong>
                  {user.username || user.name || user.email}
                </strong>
              </span>

              <button
                type="button"
                onClick={onLogout}
                className="nav-button"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log In
              </NavLink>

              <NavLink
                to="/signup"
                className="nav-signup-link"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}