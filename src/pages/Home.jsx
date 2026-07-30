import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ApplicationCard from "../components/ApplicationCard.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch(`${API_URL}/api/applications`);
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error || "Could not load applications");
        }
        setApplications(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  if (loading) return <p className="state">Loading applications...</p>;
  if (error) return <p className="state error" role="alert">{error}</p>;

  return (
    <section>
      <h1>My Applications</h1>
      <p className="subtitle">
        {applications.length} {applications.length === 1 ? "application" : "applications"}
      </p>

      {applications.length === 0 ? (
        <p className="state">
          No applications yet. <Link to="/applications/new">Add your first one</Link>.
        </p>
      ) : (
        <div className="application-grid">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;