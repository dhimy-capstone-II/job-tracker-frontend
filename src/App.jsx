import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ApplicationPage from "./pages/ApplicationPage.jsx";
import CreateApplicationPage from "./pages/CreateApplicationPage.jsx";
import EditApplicationPage from "./pages/EditApplicationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/applications/new"
          element={<CreateApplicationPage />}
        />

        <Route
          path="/applications/:id"
          element={<ApplicationPage />}
        />

        <Route
          path="/applications/:id/edit"
          element={<EditApplicationPage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;