// ============================================================
// LAYOUT — DashboardLayout
// Dipakai untuk semua halaman dalam /dashboard/*
// Berisi: Sidebar navigasi + area konten utama
//
// Saat tambah menu baru:
//   1. Tambah item di array `navItems` di bawah
//   2. Buat halaman di features/<nama-fitur>/pages/
//   3. Daftarkan route di router/index.tsx
// ============================================================

import { Outlet, NavLink, useNavigate } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  // Tambah menu baru di sini — contoh:
  // { label: 'Janji Temu', path: '/dashboard/appointments', icon: '📅' },
  // { label: 'Layanan',    path: '/dashboard/services',     icon: '✂️' },
  // { label: 'Staff',      path: '/dashboard/staff',        icon: '👥' },
  // { label: 'Pelanggan',  path: '/dashboard/customers',    icon: '🙋' },
  // { label: 'Pengaturan', path: '/dashboard/settings',     icon: '⚙️' },
]

export function DashboardLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <span className="text-base font-bold text-gray-900">BarberSaaS</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                ].join(' ')
              }
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="text-base leading-none">🚪</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
