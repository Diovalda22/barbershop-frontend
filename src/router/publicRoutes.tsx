// ============================================================
// ROUTER — Public Routes
// Route yang bisa diakses siapa saja tanpa login
// ============================================================

import type { RouteObject } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { LandingPage } from '@/features/landing/pages/pointcut/LandingPage'

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      // Tambah halaman publik lain di sini (misal: /pricing, /about)
    ],
  },
]
