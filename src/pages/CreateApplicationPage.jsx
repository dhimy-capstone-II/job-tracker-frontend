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
      company,
      position,
      status,
      location: location || null,
      dateApplied: dateApplied || null,
      jobLink: jobLink || null,
      notes: notes || null,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",

          // Send the JWT cookie to the protected backend route.
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(application),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          data.error ||
            "Something went wrong. Please try again.",
        );
        return;
      }

      navigate(`/applications/${data.id}`);
    } catch {
      setError("Could not connect to the backend.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="form-page">
      <div className="application-form-card">
        <h1>New Application</h1>

        <form
          className="application-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <p className="state error">{error}</p>
          )}

          <label>
            Company
            <input
              type="text"
              value={company}
              onChange={(event) =>
                setCompany(event.target.value)
              }
              required
            />
          </label>

          <label>
            Position
            <input
              type="text"
              value={position}
              onChange={(event) =>
                setPosition(event.target.value)
              }
              required
            />
          </label>

          <label>
            Status
            <select
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
          </label>

          <label>
            Location
            <input
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
            />
          </label>

          <label>
            Date applied
            <input
              type="date"
              value={dateApplied}
              onChange={(event) =>
                setDateApplied(event.target.value)
              }
            />
          </label>

          <label>
            Job link
            <input
              type="url"
              placeholder="https://company.com/jobs/123"
              value={jobLink}
              onChange={(event) =>
                setJobLink(event.target.value)
              }
            />
          </label>

          <label>
            Notes
            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : "Save Application"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateApplicationPage;