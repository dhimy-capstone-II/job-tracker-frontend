import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ user, isLoading, children }) {
  const location = useLocation();

  if (isLoading) {
    return <p className="status-message">Checking your session...</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;