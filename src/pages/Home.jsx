import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ApplicationCard from "../components/ApplicationCard.jsx";
import { getApplications } from "../api/applications.js";

function Home() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.company.toLowerCase().includes(search.toLowerCase()) ||
      application.position.toLowerCase().includes(search.toLowerCase()) ||
      application.status.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <section className="page-container">
        <h1>My Applications</h1>
        <p>Loading applications...</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="page-container">
        <p className="status-message status-message-error">
          Error: {loadError}
        </p>
      </section>
    );
  }

  return (
    <section className="page-container">
      <h1>My Applications</h1>

      <p className="page-description">
        Track and manage your job application progress.
      </p>

      <p className="subtitle">
        {filteredApplications.length}{" "}
        {filteredApplications.length === 1
          ? "application"
          : "applications"}
      </p>

      <div className="application-controls">
        <input
          type="text"
          placeholder="Search company, position, or status"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setStatusFilter("All");
          }}
        />

        <label htmlFor="status-filter">Filter by status</label>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Saved">Saved</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Closed">Closed</option>
        </select>

        {(search || statusFilter !== "All") && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredApplications.length === 0 ? (
        <p className="state">
          No matching applications found.{" "}
          <Link to="/applications/new">Add a new application</Link>
        </p>
      ) : (
        <div className="application-grid">
          {filteredApplications.map((application) => (
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