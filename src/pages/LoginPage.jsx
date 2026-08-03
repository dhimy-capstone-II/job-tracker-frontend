import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { login } from "../api/auth.js";
import FormField from "../components/FormField.jsx";

// Login validation only checks whether the fields are empty.
//
// We do not check password length here because the server should be the only
// place that decides whether the credentials are correct.
function validateForm(formData) {
  const errors = {};

  if (!formData.identifier) {
    errors.identifier = "Email or username is required";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  }

  return errors;
}

// setUser comes from App.jsx.
//
// After login succeeds, we update the user state so the Navbar and protected
// routes immediately know that the user is authenticated.
function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Used by the social-login button.
  const { loginWithRedirect } = useAuth0();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // If ProtectedRoute redirected the user to login, it stores the page the
  // user originally requested in location.state.from.
  const redirectTo = location.state?.from ?? "/";

  // One handler works for both fields because each input name matches
  // a property in formData.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    // Clear the field error while the user corrects it.
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  }

  async function handleSubmit(event) {
    // Prevent the browser from refreshing the entire page.
    event.preventDefault();

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const loggedInUser = await login(formData);

      // Update authentication state in App.jsx.
      setUser(loggedInUser);

      // Return the user to the requested protected page or the home page.
      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
      // The backend deliberately returns one general invalid-credentials
      // message instead of revealing whether the account exists.
      setErrors({
        general: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="login-page">
      <div className="login-form-card">
        <h1>Log In</h1>

        <p>Welcome back. Log in to continue managing your job applications.</p>

        {errors.general && (
          <p role="alert" className="state error">
            {errors.general}
          </p>
        )}

        {/* noValidate disables the browser's default popup messages so this
            page uses the validation messages defined above. */}
        <form className="application-form" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email or username"
            name="identifier"
            placeholder="you@example.com"
            autoComplete="username"
            value={formData.identifier}
            onChange={handleChange}
            error={errors.identifier}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </form>

        {/* Auth0 is the second authentication option.
            Auth0 collects the external provider credential, so your
            application never receives that provider password. */}
        <div className="auth-divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <button
          type="button"
          className="auth0-button"
          onClick={() => loginWithRedirect()}
        >
          Continue with Auth0
        </button>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
