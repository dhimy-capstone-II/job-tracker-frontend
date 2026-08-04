import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function CreateApplicationPage() {
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Saved");
  const [location, setLocation] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

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
      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          data.error ||
            data.message ||
            "Something went wrong. Please try again."
        );
        return;
      }

      navigate(`/applications/${data.id}`);
    } catch (requestError) {
      console.error("Create application error:", requestError);
      setError("Could not connect to the backend. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="form-page">
      <section
        className="application-form-card"
        aria-labelledby="new-application-heading"
      >
        <div className="form-header">
          <p className="form-eyebrow">Job Tracker</p>

          <h1 id="new-application-heading">
            New Application
          </h1>

          <p className="form-description">
            Add a new job application and track its progress.
          </p>
        </div>

        <form
          className="application-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {error && (
            <div
              id="application-error-message"
              className="application-error"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <span
                className="application-error-icon"
                aria-hidden="true"
              >
                !
              </span>

              <span>{error}</span>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="company">
                Company
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="company"
                name="company"
                type="text"
                value={company}
                onChange={(event) => {
                  setCompany(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Example: OpenAI"
                autoComplete="organization"
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error
                    ? "application-error-message"
                    : undefined
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">
                Position
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="position"
                name="position"
                type="text"
                value={position}
                onChange={(event) => {
                  setPosition(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Example: Software Engineer"
                autoComplete="organization-title"
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error
                    ? "application-error-message"
                    : undefined
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Interview">
                  Interview
                </option>
                <option value="Offer">Offer</option>
                <option value="Rejected">
                  Rejected
                </option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Example: New York, NY or Remote"
                autoComplete="address-level2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateApplied">
                Date applied
              </label>

              <input
                id="dateApplied"
                name="dateApplied"
                type="date"
                value={dateApplied}
                onChange={(event) =>
                  setDateApplied(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobLink">
                Job link
              </label>

              <input
                id="jobLink"
                name="jobLink"
                type="url"
                placeholder="https://company.com/jobs/123"
                value={jobLink}
                onChange={(event) =>
                  setJobLink(event.target.value)
                }
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="6"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Add recruiter details, interview notes, follow-up tasks, or other information."
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : "Save Application"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreateApplicationPage;