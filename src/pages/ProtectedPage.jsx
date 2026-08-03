import { useState } from "react";

import { getApplications } from "../api/applications.js";

export default function ProtectedPage({ user }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setResult(null);
    setError("");
    setLoading(true);

    try {
      const applications = await getApplications();

      setResult({
        message: "Protected request succeeded",
        username: user?.username,
        applicationCount: applications.length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="protected-page">
      <h1>Protected Page</h1>

      <p>
        You can only view this page while logged in
        {user?.username ? ` as ${user.username}` : ""}.
      </p>

      <button
        type="button"
        onClick={handleTest}
        disabled={loading}
      >
        {loading ? "Testing..." : "Test protected request"}
      </button>

      {error && <p className="state error">{error}</p>}

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}