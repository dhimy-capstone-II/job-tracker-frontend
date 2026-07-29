import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section>
      <h1>404 - Page Not Found</h1>

      <Link to="/">Return Home</Link>
    </section>
  );
}

export default NotFoundPage;