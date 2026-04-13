// ============================================================
// ROUTER — Auth Routes
// Route untuk halaman login dan register
// ============================================================

import type { RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { CustomerLoginPage } from '@/features/landing/pages/pointcut/CustomerLoginPage'
import { CustomerRegisterPage } from '@/features/landing/pages/pointcut/CustomerRegisterPage'

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <CustomerLoginPage /> },
      { path: '/register', element: <CustomerRegisterPage /> },
    ],
  },
]
