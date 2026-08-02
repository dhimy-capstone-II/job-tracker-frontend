import { Link } from "react-router-dom";

// Rendered by the "*" route in App.jsx when no other route matches.
export default function NotFoundPage() {
  return (
    <section className="not-found-page">
      <h1>404</h1>
      <p>That page does not exist.</p>

      <Link to="/" className="not-found-link">
        Go home
      </Link>
    </section>
  );
}