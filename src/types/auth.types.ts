// ============================================================
// TYPES — Auth
// Definisi tipe data terkait autentikasi dan user
// ============================================================

export interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'staff' | 'admin'
  tenantId: string
  avatar?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  shop_name: string
}

export interface AuthResponse {
  user: User
  token: string
}
