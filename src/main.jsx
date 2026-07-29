// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import App from "./App.jsx";
// import Home from "./pages/Home.jsx";
// import ApplicationPage from "./pages/ApplicationPage.jsx";
// import CreateApplicationPage from "./pages/CreateApplicationPage.jsx";
// import EditApplicationPage from "./pages/EditApplicationPage.jsx";
// import NotFoundPage from "./pages/NotFoundPage.jsx";

// import "./index.css";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route element={<App />}>
//           <Route path="/" element={<Home />} />

//           <Route path="/applications/new" element={<CreateApplicationPage />} />
//           <Route path="/applications/:id" element={<ApplicationPage />} />
//           <Route
//             path="/applications/:id/edit"
//             element={<EditApplicationPage />}
//           />
//           <Route path="*" element={<NotFoundPage />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   </StrictMode>,
// );


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);