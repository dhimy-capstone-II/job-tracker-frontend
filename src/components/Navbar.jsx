import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Job Tracker</Link>
      <div>
        <Link to="/">Home</Link>
        <Link to="/applications/new">+ New Application</Link>
      </div>
    </nav>
  );
}

export default Navbar;



