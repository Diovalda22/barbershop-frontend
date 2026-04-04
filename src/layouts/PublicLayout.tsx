// ============================================================
// LAYOUT — PublicLayout
// Dipakai untuk halaman publik (Landing, Pricing, About, dll)
// Berisi Navbar di atas dan Footer di bawah
// ============================================================

import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar — ganti dengan komponen Navbar sesungguhnya */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            BarberSaaS
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Masuk
            </a>
            <a
              href="/register"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
              Daftar Gratis
            </a>
          </div>
        </nav>
      </header>

      {/* Konten halaman */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BarberSaaS. All rights reserved.
      </footer>
    </div>
  )
}
