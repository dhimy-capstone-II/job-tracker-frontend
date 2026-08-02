import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  deleteApplication,
  getApplication,
} from "../api/applications.js";

function ApplicationPage() {
  // Get the application ID from the URL.
  const { id } = useParams();
  const navigate = useNavigate();

  // Store one application.
  const [application, setApplication] = useState(null);

  // Store an error from loading the application.
  const [loadError, setLoadError] = useState("");

  // Store an error from deleting the application.
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadApplication() {
      try {
        const data = await getApplication(id);

        if (active) {
          setApplication(data);
        }
      } catch (err) {
        if (active) {
          setLoadError(err.message);
        }
      }
    }

    loadApplication();

    // Ignore a response that arrives after leaving the page.
    return () => {
      active = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Delete this application?")) {
      return;
    }

    setError("");

    try {
      await deleteApplication(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loadError) {
    return <p className="state error">{loadError}</p>;
  }

  if (!application) {
    return <p className="state">Loading application...</p>;
  }

  // Change YYYY-MM-DD into MM/DD/YYYY.
  function formatDate(date) {
    if (!date) {
      return "Not provided";
    }

    const [year, month, day] = date.split("-");

    return `${month}/${day}/${year}`;
  }

  return (
    <section className="application-details">
      <Link to="/" className="back-link">
        ← All Applications
      </Link>

      <div className="details-card">
        <h1>{application.company}</h1>

        <p className="details-position">
          {application.position}
        </p>

        <span
          className={`badge badge-${application.status.toLowerCase()}`}
        >
          {application.status}
        </span>

        <p>
          <strong>Location:</strong>{" "}
          {application.location || "Not provided"}
        </p>

        <p>
          <strong>Date applied:</strong>{" "}
          {formatDate(application.dateApplied)}
        </p>

        <p>
          <strong>Notes:</strong>{" "}
          {application.notes || "No notes"}
        </p>

        {application.jobLink && (
          <a
            href={application.jobLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Job Posting
          </a>
        )}

        {error && <p className="state error">{error}</p>}

        <div className="details-actions">
          <Link
            to={`/applications/${id}/edit`}
            className="button-link"
          >
            Edit
          </Link>

          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}

export default ApplicationPage;