import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { request } from "../api/client.js";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username }),
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-page">
      <div className="login-form-card">
        <h1>Log In</h1>

        <form className="application-form" onSubmit={handleSubmit}>
          {error && <p className="state error">{error}</p>}

          <label>
            Username
            <input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;