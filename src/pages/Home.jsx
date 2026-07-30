import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ApplicationCard from "../components/ApplicationCard.jsx";

function Home() {
  // Store all applications returned by the backend.
  const [applications, setApplications] = useState([]);

  // Track whether the request is still running.
  const [loading, setLoading] = useState(true);

  // Store an error message if loading fails.
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch all job applications from the backend.
    async function getApplications() {
      try {
        const res = await fetch(`${API_URL}/api/applications`);

        // Stop and move to the catch block when the request fails.
        if (!res.ok) {
          throw new Error("Could not load your applications.");
        }

        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setLoadError(err.message);
      } finally {
        // Stop showing the loading message whether the request succeeds or fails.
        setLoading(false);
      }
    }

    getApplications();
  }, []);

  if (loading) {
    return <p className="status-message">Loading applications...</p>;
  }

  if (loadError) {
    return (
      <p className="status-message status-message-error">
        Error: {loadError}
      </p>
    );
  }

  // Display all applications.
  return (
    <section>
      <h1>My Applications</h1>

      <p className="subtitle">
        {applications.length}{" "}
        {applications.length === 1 ? "application" : "applications"}
      </p>

      {applications.length === 0 ? (
        <p className="state">
          No applications yet.{" "}
          <Link to="/applications/new">Add your first one</Link>
        </p>
      ) : (
        <div className="application-grid">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;