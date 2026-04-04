// ============================================================
// PAGE — RegisterPage
// Route: /register
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { RegisterPayload } from '@/types/auth.types'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    shop_name: '',
    password: '',
    password_confirmation: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Hubungkan ke API register
    // await authService.register(form)

    // Simulasi register (hapus saat API sudah siap)
    await new Promise((r) => setTimeout(r, 800))
    navigate('/login')

    setIsLoading(false)
  }

  const fields: Array<{ name: keyof RegisterPayload; label: string; type: string; placeholder: string }> = [
    { name: 'name',                  label: 'Nama Lengkap',     type: 'text',     placeholder: 'Budi Santoso' },
    { name: 'shop_name',             label: 'Nama Barbershop',  type: 'text',     placeholder: 'Barber 99' },
    { name: 'email',                 label: 'Email',            type: 'email',    placeholder: 'kamu@barbershop.com' },
    { name: 'password',              label: 'Password',         type: 'password', placeholder: '••••••••' },
    { name: 'password_confirmation', label: 'Konfirmasi Password', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buat akun baru</h1>
        <p className="mt-1 text-sm text-gray-500">
          Daftarkan barbershop-mu, gratis selamanya untuk fitur dasar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60 transition-colors"
        >
          {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium text-gray-900 hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  )
}
