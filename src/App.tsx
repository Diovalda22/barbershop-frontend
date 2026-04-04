// ============================================================
// App.tsx — Entry point komponen
// Hanya bertugas render RouterProvider.
// Jangan taruh logic atau UI di sini.
// ============================================================

import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

function App() {
  return <RouterProvider router={router} />
}

export default App
