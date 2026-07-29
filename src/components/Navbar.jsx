import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">Job Application Tracker</Link>
      <nav className="nav-links">
        <Link to="/">All Applications</Link>
        <Link to="/applications/new" className="btn">+ New Application</Link>
      </nav>
    </header>
  );
}

export default Navbar;