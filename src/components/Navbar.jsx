import { NavLink } from "react-router-dom";

// NavLink handles client-side navigation and lets us style the active route.
export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header>
      <nav>
        <NavLink to="/" className="nav-brand">
          Job Application Tracker
        </NavLink>

        <div className="nav-links">
          {/* `end` keeps Home active only on the exact "/" route. */}
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