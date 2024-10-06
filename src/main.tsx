import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./css/index.css";
// import Home from "./tsx/pages/Home";
import Error from "./tsx/pages/Error";
import Simulation from "./tsx/pages/Simulation";

const router = createBrowserRouter([
  { path: "/", element: <Simulation />, errorElement: <Error /> },
  // { path: "/play", element: <Play />, errorElement: <Error /> },
  { path: "*", element: <Error /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
