import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getApplication,
  updateApplication,
} from "../api/applications.js";

function EditApplicationPage() {
  // Get the application ID from the URL.
  const { id } = useParams();

  // Navigate after updating.
  const navigate = useNavigate();

  // Store the form values.
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Saved");
  const [location, setLocation] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // Blocks a double-click from firing two update requests.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store an error from loading the application.
  const [loadError, setLoadError] = useState("");

  // Store a validation message returned by the backend.
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadApplication() {
      try {
        const data = await getApplication(id);

        if (!active) {
          return;
        }

        // Fill the form with the existing data.
        setCompany(data.company);
        setPosition(data.position);
        setStatus(data.status);
        setLocation(data.location || "");
        setDateApplied(data.dateApplied || "");
        setJobLink(data.jobLink || "");
        setNotes(data.notes || "");
      } catch (err) {
        if (active) {
          setLoadError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadApplication();

    // Ignore a response that arrives after leaving the page.
    return () => {
      active = false;
    };
  }, [id]);

  // Update the application.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Empty optional fields must be sent as null, not "".
    //
    // The model validates dateApplied with isDate and jobLink with isUrl.
    // Those validators run on any non-null value, so an empty string fails
    // them ("Date applied must be a valid date"). null skips validation
    // because both columns allow null.
    const application = {
      company: company.trim(),
      position: position.trim(),
      status,
      location: location.trim() || null,
      dateApplied: dateApplied || null,
      jobLink: jobLink.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      await updateApplication(id, application);

      // Return to the details page after the update succeeds.
      navigate(`/applications/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (loadError) {
    return <p className="state error">{loadError}</p>;
  }

  return (
    <section className="form-page">
      <div className="application-form-card">
        <h1>Edit Application</h1>

        <form className="application-form" onSubmit={handleSubmit}>
          {error && <p className="state error">{error}</p>}

          <label>
            Company
            <input
              required
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </label>

          <label>
            Position
            <input
              required
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option>Saved</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
              <option>Closed</option>
            </select>
          </label>

          <label>
            Location
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </label>

          <label>
            Date applied
            <input
              type="date"
              value={dateApplied}
              onChange={(event) => setDateApplied(event.target.value)}
            />
          </label>

          <label>
            Job Posting URL
            <input
              type="url"
              placeholder="https://company.com/jobs/123"
              value={jobLink}
              onChange={(event) => setJobLink(event.target.value)}
            />
          </label>

          <label>
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Update Application"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditApplicationPage;