import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const API_URL = import.meta.env.VITE_API_URL;

function CreateApplicationPage() {
  // Navigate to another page after creating the application
  const navigate = useNavigate();

  // Store the value of each form input
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Saved");
  const [location, setLocation] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [notes, setNotes] = useState("");

  // Store a validation message returned by the backend
  const [error, setError] = useState("");

  // Submit the form and create a new application
  async function handleSubmit(event) {
    // Prevent the page from refreshing
    event.preventDefault();

    // Clear the error from any previous attempt
    setError("");

    // Build the new application object
    const application = {
      company,
      position,
      status,
      location,
      dateApplied,
      jobLink,
      notes,
    };

    // Send the new application to the backend
    const response = await fetch(`${API_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });

    // Read the application returned by the backend
    const data = await response.json();

    // Show the backend's message instead of navigating to a broken page
    if (!response.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    // Navigate to the new application's details page
    navigate(`/applications/${data.id}`);
  }


  // Display the create application page
return (
  <section className="form-page">
    <div className="application-form-card">
      <h1>New Application</h1>

      {/* Submit the form to create an application */}
      <form className="application-form" onSubmit={handleSubmit}>
        {error && <p className="state error">{error}</p>}

        <label>
          Company
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </label>

        <label>
          Position
          <input
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

          {error.toLowerCase().includes("date") && (
            <span className="field-error">{error}</span>
          )}
        </label>

        <label>
          Job link
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

        <button type="submit">Save Application</button>
      </form>
    </div>
  </section>
  );
}

export default CreateApplicationPage;