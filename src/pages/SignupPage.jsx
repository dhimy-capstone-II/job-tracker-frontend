import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { signup } from "../api/auth.js";
import FormField from "../components/FormField.jsx";

// Validation stays outside the component because it does not use state,
// props, or browser features. It receives the form values and returns
// an errors object.
//
// This frontend validation helps the user, but the backend still performs
// its own validation because someone can call the API without using this form.
function validateForm(formData) {
  const errors = {};

  const username = formData.username.trim();
  const email = formData.email.trim();

  if (!username) {
    errors.username = "Username is required";
  } else if (username.length < 3 || username.length > 20) {
    errors.username =
      "Username must be between 3 and 20 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!email.includes("@")) {
    errors.email = "Enter a valid email address";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password =
      "Password must be at least 6 characters";
  }

  return errors;
}

// setUser comes from App.jsx.
//
// After signup succeeds, the backend returns the new user and sets the
// JWT cookie. We save that user in App so the navbar and protected pages
// immediately know that the user is logged in.
function SignupPage({ setUser }) {
  const navigate = useNavigate();

  // Auth0 provides the social-login redirect function.
  const { loginWithRedirect } = useAuth0();

  // Store all three form fields in one object.
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Store validation and backend errors.
  const [errors, setErrors] = useState({});

  // Prevent repeated submissions while the request is running.
  const [isLoading, setIsLoading] = useState(false);

  // One change handler works for all inputs because each input's name
  // matches a property in formData.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    // Clear the current field error while the user corrects it.
    if (errors[name] || errors.general) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
        general: "",
      }));
    }
  }

  async function handleSubmit(event) {
    // Prevent the browser from refreshing the whole page.
    event.preventDefault();

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      // POST /auth/signup with:
      // { username, email, password }
      //
      // The backend hashes the password, creates the user,
      // and places the JWT in an httpOnly cookie.
      const newUser = await signup({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Update the authenticated user in App.jsx.
      setUser(newUser);

      // Send the user directly to the protected home page.
      navigate("/", {
        replace: true,
      });
    } catch (error) {
      // Backend errors such as duplicate email or username appear here.
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
        <h1>Create Account</h1>

        <p>
          Create an account to save and manage your job applications.
        </p>

        {errors.general && (
          <p role="alert" className="state error">
            {errors.general}
          </p>
        )}

        {/* noValidate disables the browser popup messages so the form uses
            the validation messages defined above. */}
        <form
          className="application-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <FormField
            label="Username"
            name="username"
            placeholder="Choose a username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        {/* Auth0 is the second authentication option.
            Auth0 collects the credential, so your app never receives
            or stores the social provider password. */}
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
          Already have an account?{" "}
          <Link to="/login">Log In</Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;