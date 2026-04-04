// ============================================================
// LAYOUT — AuthLayout
// Dipakai untuk halaman Login dan Register
// Layout sederhana: dua kolom (form kiri, ilustrasi kanan)
// ============================================================

import { Outlet, Link } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Kolom kiri — Form */}
      <div className="flex flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="text-lg font-bold text-gray-900">BarberSaaS</span>
          </Link>

          {/* Konten halaman (LoginPage / RegisterPage) */}
          <Outlet />
        </div>
      </div>

      {/* Kolom kanan — Ilustrasi / Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gray-900 p-12 text-white">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl mb-6">✂️</div>
          <h2 className="text-3xl font-bold leading-tight">
            Kelola barbershop-mu lebih mudah
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Jadwalkan janji, kelola staff, dan pantau revenue — semua dalam satu
            platform.
          </p>
        </div>
      </div>
    </div>
  )
}
