// ============================================================
// PAGE — DashboardPage
// Route: /dashboard (index)
// Placeholder — isi dengan widget dan data asli nanti
// ============================================================

export function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang kembali! Ini ringkasan hari ini.
        </p>
      </div>

      {/* Stats placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Janji Hari Ini', value: '—', icon: '📅' },
          { label: 'Revenue Bulan Ini', value: '—', icon: '💰' },
          { label: 'Total Pelanggan', value: '—', icon: '👥' },
          { label: 'Staff Aktif', value: '—', icon: '✂️' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-white p-5 space-y-3"
          >
            <div className="text-2xl">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content placeholder */}
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-400">
        <p className="text-sm">Konten dashboard akan muncul di sini</p>
      </div>
    </div>
  )
}
