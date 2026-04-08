// ============================================================
// ROUTER — Public Routes
// Route yang bisa diakses siapa saja tanpa login
// ============================================================

import type { RouteObject } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { LandingPage } from '@/features/landing/pages/pointcut/LandingPage'
import { ReservationPage } from '@/features/landing/pages/pointcut/ReservationPage'
import { CustomerLoginPage } from '@/features/landing/pages/pointcut/CustomerLoginPage'
import { CustomerRegisterPage } from '@/features/landing/pages/pointcut/CustomerRegisterPage'

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'booking', element: <ReservationPage /> },
      { path: 'user/login', element: <CustomerLoginPage /> },
      { path: 'user/register', element: <CustomerRegisterPage /> },
    ],
  },
]
