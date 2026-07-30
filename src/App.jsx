import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import ApplicationPage from "./pages/ApplicationPage.jsx";
import CreateApplicationPage from "./pages/CreateApplicationPage.jsx";
import EditApplicationPage from "./pages/EditApplicationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

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
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
