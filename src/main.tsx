import { NotFoundPage } from "@app/error-pages.tsx";
import RootLayout from "@app/layout.tsx";
import pages from "@app/pages.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Navigate to="/tasks" />} />
          {Object.entries(pages).map(([path, { element }]) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
