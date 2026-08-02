// src/components/Navbar.jsx
// NavLink handles client-side navigation and lets us style the active route.

import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header>
      <nav>
        <NavLink to="/" className="nav-brand">
          Job Application Tracker
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/applications/new" className={linkClass}>
            New Application
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;