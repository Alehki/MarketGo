import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  base: '/MarketGo/', // 👈 Nombre exacto de tu repo en GitHub
})