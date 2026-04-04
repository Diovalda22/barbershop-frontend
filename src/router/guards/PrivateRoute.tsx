// ============================================================
// GUARD — PrivateRoute
// Wrapper untuk route yang butuh autentikasi.
// Jika belum login → redirect ke /login
//
// Cara pakai:
//   <PrivateRoute><DashboardLayout /></PrivateRoute>
// ============================================================

import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PrivateRouteProps {
  children: ReactNode
}

function useIsAuthenticated(): boolean {
  return Boolean(localStorage.getItem('auth_token'))
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
