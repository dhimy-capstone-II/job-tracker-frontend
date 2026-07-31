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

  // Store the search text and selected status.
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch all job applications from the backend.
    async function getApplications() {
      try {
        const res = await fetch(`${API_URL}/api/applications`);

        if (!res.ok) {
          throw new Error("Could not load your applications.");
        }

        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getApplications();
  }, []);

  // Create a filtered list.
  const filteredApplications = applications.filter((application) => {
    // Search by company, position, or status.
    const matchesSearch =
      application.company.toLowerCase().includes(search.toLowerCase()) ||
      application.position.toLowerCase().includes(search.toLowerCase()) ||
      application.status.toLowerCase().includes(search.toLowerCase());

    // Check whether the selected status matches the application.
    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    // Keep applications that match both conditions.
    return matchesSearch && matchesStatus;
  });

  // Show a temporary message while the data is loading.
  if (loading) {
    return (
      <main className="page-container">
        <h1>My Applications</h1>
        <p>Loading applications...</p>
      </main>
    );
  }

  // Show an error message when the request fails.
  if (loadError) {
    return (
      <p className="status-message status-message-error">
        Error: {loadError}
      </p>
    );
  }

return (
  <section>
    {/* Display the page title and a short description. */}
    <h1>My Applications</h1>

    <p className="page-description">
      Track and manage your job application progress.
    </p>

    {/* Show how many filtered applications are visible. */}
    <p className="subtitle">
      {filteredApplications.length}{" "}
      {filteredApplications.length === 1
        ? "application"
        : "applications"}
    </p>

    {/* Search, filter, and reset controls. */}
    <div className="application-controls">
      <input
        type="text"
        placeholder="Search company, position, or status"
        value={search}
        onChange={(event) => {
          // Update the search text.
          setSearch(event.target.value);

          // Reset the dropdown while the user searches.
          setStatusFilter("All");
        }}
      />

      <select
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

      {/* Show this button only when a search or filter is active. */}
            {/* Is there text in the search box? or 
            Is the selected status different from "All"? */}

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

    {/* Show a message when no applications match. */}
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