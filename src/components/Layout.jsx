// src/components/Layout.jsx
// Layout is the shared frame for every page.
// <Outlet /> displays the page that matches the current route.

import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div className="app">
      <Navbar />

      <main className="page-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}