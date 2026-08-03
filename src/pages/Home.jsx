import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ApplicationCard from "../components/ApplicationCard.jsx";
import { getApplications } from "../api/applications.js";

function Home({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadApplications() {
      try {
        setLoadError("");

        const data = await getApplications();
        setApplications(data);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [user]);

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      application.company.toLowerCase().includes(searchText) ||
      application.position.toLowerCase().includes(searchText) ||
      application.status.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Public home page for logged-out users.
  if (!user) {
    return (
      <section className="public-home">
        <div className="public-home-card">
          <p className="public-home-eyebrow">Organize your job search</p>

          <h1>Job Application Tracker</h1>

          <p className="public-home-description">
            Save opportunities, track application progress, and manage your job
            search in one place.
          </p>

          <div className="public-home-actions">
            <Link to="/login" className="primary-link">
              Log In
            </Link>

            <Link to="/signup" className="secondary-link">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
        {filteredApplications.length === 1 ? "application" : "applications"}
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
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
