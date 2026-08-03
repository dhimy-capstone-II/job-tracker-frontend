import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ApplicationPage from "./pages/ApplicationPage.jsx";
import CreateApplicationPage from "./pages/CreateApplicationPage.jsx";
import EditApplicationPage from "./pages/EditApplicationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import { getMe, syncUser, logoutRequest } from "./api/auth.js";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [authError, setAuthError] = useState(null);

  const {
    isAuthenticated: isAuth0User,
    user: auth0User,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    logout: auth0Logout,
  } = useAuth0();

  const isLoading =
    isCheckingSession || isAuth0Loading || (isAuth0User && !user && !authError);

  // Check local JWT cookie
  useEffect(() => {
    async function checkIfLoggedIn() {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkIfLoggedIn();
  }, []);

  // Sync Auth0 user
  useEffect(() => {
    if (!isAuth0User || !auth0User) return;

    async function saveAuth0User() {
      try {
        const token = await getAccessTokenSilently();

        const dbUser = await syncUser(token, {
          username: auth0User.nickname || auth0User.email?.split("@")[0],
        });

        setUser(dbUser);
        setAuthError(null);
      } catch (error) {
        setAuthError(
          `Signed in with Auth0, but we couldn't load your account: ${error.message}`,
        );
      }
    }

    saveAuth0User();
  }, [isAuth0User, auth0User, getAccessTokenSilently]);

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch (error) {
      // Still log the user out locally.
      console.error("Logout failed:", error.message);
    }

    setUser(null);
    setAuthError(null);

    if (isAuth0User) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
  }

  return (
    <Routes>
      <Route
        element={
          <Layout user={user} onLogout={handleLogout} authError={authError} />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        <Route path="/signup" element={<SignupPage setUser={setUser} />} />

        <Route
          path="/applications/new"
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <CreateApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <ApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id/edit"
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <EditApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
