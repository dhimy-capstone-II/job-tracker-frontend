// src/components/ProtectedRoute.jsx
// Protects frontend pages that require a logged-in user.
//
// This controls what React renders, but the backend still provides the real
// security through requireAuth.

import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  user,
  isLoading,
  children,
}) {
  const location = useLocation();

  // Wait until App finishes checking the current session.
  if (isLoading) {
    return <p>Checking your session...</p>;
  }

  // Send logged-out users to the login page.
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Render the protected page when the user is logged in.
  return children;
}