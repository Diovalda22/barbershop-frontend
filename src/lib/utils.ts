import { type ClassValue, clsx } from 'clsx'

/**
 * Gabungkan class names dengan aman (mirip cn() dari shadcn)
 * Perlu install: npm install clsx
 * Kalau belum install, bisa pakai versi sederhana di bawah
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// ---- Versi tanpa clsx (fallback) ----
// export function cn(...classes: (string | undefined | null | false)[]) {
//   return classes.filter(Boolean).join(' ')
// }

/**
 * Format angka ke format mata uang IDR
 * Contoh: formatCurrency(50000) → "Rp 50.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format tanggal ke string readable
 * Contoh: formatDate(new Date()) → "5 April 2026"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
