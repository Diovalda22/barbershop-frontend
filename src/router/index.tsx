// ============================================================
// ROUTER — Root
// Semua route dikumpulkan di sini. Tambah route baru:
//   1. Buat file routenya di folder router/
//   2. Import dan spread ke dalam children di sini
// ============================================================

import { createBrowserRouter, Navigate } from 'react-router-dom'
import { authRoutes } from './authRoutes'
import { publicRoutes } from './publicRoutes'

// Placeholder dashboard — ganti dengan fitur sesungguhnya nanti
import { DashboardPage } from '@/pages/DashboardPage'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PrivateRoute } from './guards/PrivateRoute'

export const router = createBrowserRouter([
  // ── Public routes (Landing, dsb) ──────────────────────────
  ...publicRoutes,

  // ── Auth routes (Login, Register) ────────────────────────
  ...authRoutes,

  // ── Protected routes (Dashboard, dll) ────────────────────
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      // Tambah child route di sini saat fitur baru dibuat
      // Contoh: { path: 'appointments', element: <AppointmentsPage /> }
    ],
  },

  // ── Fallback ──────────────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
])
