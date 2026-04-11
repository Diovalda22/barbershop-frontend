// ============================================================
// ROUTER — Root
// Semua route dikumpulkan di sini. Tambah route baru:
//   1. Buat file routenya di folder router/
//   2. Import dan spread ke dalam children di sini
// ============================================================

import { createBrowserRouter, Navigate } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { publicRoutes } from "./publicRoutes";
import { adminRoutes } from "./adminRoutes";

export const router = createBrowserRouter([
  ...publicRoutes,

  ...authRoutes,

  ...adminRoutes,

  { path: "*", element: <Navigate to="/" replace /> },
]);
