import { NavLink } from "react-router-dom";

// NavLink handles client-side navigation and styles the active route.
export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="site-header">
      <nav className="navbar">
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

          <NavLink to="/login" className={linkClass}>
            Log In
          </NavLink>
        </div>
      </nav>
    </header>
  );
}