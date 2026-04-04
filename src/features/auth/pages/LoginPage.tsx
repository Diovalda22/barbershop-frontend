// ============================================================
// PAGE — LoginPage
// Route: /login
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { LoginPayload } from '@/types/auth.types'

export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Hubungkan ke API auth
    // const { token } = await authService.login(form)
    // localStorage.setItem('auth_token', token)

    // Simulasi login (hapus saat API sudah siap)
    await new Promise((r) => setTimeout(r, 800))
    localStorage.setItem('auth_token', 'demo-token')
    navigate('/dashboard')

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Selamat datang kembali</h1>
        <p className="mt-1 text-sm text-gray-500">
          Masuk ke akun barbershop-mu
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="kamu@barbershop.com"
            className="block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60 transition-colors"
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-gray-900 hover:underline">
          Daftar gratis
        </Link>
      </p>
    </div>
  )
}
