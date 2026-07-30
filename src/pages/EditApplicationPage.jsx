import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditApplicationPage() {
  // Get the application ID from the URL
  const { id } = useParams();

  // Navigate after updating
  const navigate = useNavigate();

  // Store the form values
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Saved");
  const [location, setLocation] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // Store an error from loading the application
  const [loadError, setLoadError] = useState("");

  // Store a validation message returned by the backend
  const [error, setError] = useState("");

  useEffect(() => {
    // Load the existing application

    const API_URL = import.meta.env.VITE_API_URL;   
    async function getApplication() {
      const response = await fetch(`${API_URL}/api/applications/${id}`);
      const data = await response.json();

      // Stop here if the application does not exist
      if (!response.ok) {
        setLoadError(data.error || "Could not load this application.");
        setLoading(false);
        return;
      }

      // Fill the form with the existing data
      setCompany(data.company);
      setPosition(data.position);
      setStatus(data.status);
      setLocation(data.location || "");
      setDateApplied(data.dateApplied || "");
      setJobLink(data.jobLink || "");
      setNotes(data.notes || "");
      setLoading(false);
    }

    getApplication();
  }, [id]);

  // Update the application
  async function handleSubmit(event) {
    event.preventDefault();

    // Clear the error from any previous attempt
    setError("");

    const application = {
      company,
      position,
      status,
      location,
      dateApplied,
      jobLink,
      notes,
    };

    const response = await fetch(`${API_URL}/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });

    // Show the backend's message instead of pretending the update worked
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    // Return to the details page
    navigate(`/applications/${id}`);
  }

  if (loading) return <p>Loading...</p>;

  if (loadError) return <p className="state error">{loadError}</p>;

  // Display the edit form
  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Application</h1>

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
      </label>

      <label>
        Job link
        <input
          type="url"
          placeholder="https://example.com/job"
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

      <button type="submit">Update Application</button>
    </form>
  );
}

export default EditApplicationPage;
