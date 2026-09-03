import { lazy, Suspense, useEffect, useState } from "react";
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

import {
  getMe,
  syncUser,
  logoutRequest,
} from "./api/auth.js";

import "./App.css";

// These two routes pull in the heaviest libraries in the project: Recharts for
// the dashboard charts and socket.io-client for the interview room. Loading
// them with lazy() means their code is downloaded only when someone actually
// visits those pages, instead of being part of the bundle every visitor gets
// just to see the login screen.
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const InterviewRoomPage = lazy(() => import("./pages/InterviewRoomPage.jsx"));

// Shown for the moment a lazy page's code is still downloading.
function PageLoading() {
  return (
    <p className="page-loading" role="status">
      Loading…
    </p>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] =
    useState(true);
  const [authError, setAuthError] = useState(null);

  const {
    isAuthenticated: isAuth0User,
    user: auth0User,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    logout: auth0Logout,
  } = useAuth0();

  const isLoading =
    isCheckingSession ||
    isAuth0Loading ||
    (isAuth0User && !user && !authError);

  // Check for a local JWT cookie.
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

  // Sync an Auth0 user with the backend database.
  useEffect(() => {
    if (!isAuth0User || !auth0User) {
      return;
    }

    async function saveAuth0User() {
      try {
        const token = await getAccessTokenSilently();

        const dbUser = await syncUser(token, {
          username:
            auth0User.nickname ||
            auth0User.email?.split("@")[0],
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
  }, [
    isAuth0User,
    auth0User,
    getAccessTokenSilently,
  ]);

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch (error) {
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
          <Layout
            user={user}
            onLogout={handleLogout}
            authError={authError}
          />
        }
      >
        {/* key={user?.id} makes React remount Home whenever the signed-in
            user changes, which resets its state for free. Without it the
            previous user's applications stay in Home's state and flash on
            screen before the new user's data loads. */}
        <Route
          path="/"
          element={<Home key={user?.id} user={user} />}
        />

        <Route
          path="/login"
          element={<LoginPage setUser={setUser} />}
        />

        <Route
          path="/signup"
          element={<SignupPage setUser={setUser} />}
        />

        {/* key={user?.id} for the same reason as Home above: remount on a
            user change so the previous user's statistics never linger. */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              user={user}
              isLoading={isLoading}
            >
              <Suspense fallback={<PageLoading />}>
                <DashboardPage key={user?.id} />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-room"
          element={
            <ProtectedRoute
              user={user}
              isLoading={isLoading}
            >
              <Suspense fallback={<PageLoading />}>
                <InterviewRoomPage key={user?.id} />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/new"
          element={
            <ProtectedRoute
              user={user}
              isLoading={isLoading}
            >
              <CreateApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute
              user={user}
              isLoading={isLoading}
            >
              <ApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/:id/edit"
          element={
            <ProtectedRoute
              user={user}
              isLoading={isLoading}
            >
              <EditApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;