import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'MarketGo',
        short_name: 'MarketGo',
        description: 'Tu tienda y app de pedidos online',
        theme_color: '#FFD600',
        background_color: '#FFD600',
        display: 'standalone',
        start_url: '/MarketGo/', // Importante que respete la base
        scope: '/MarketGo/',     // Importante para que el service worker controle la ruta
        icons: [
          {
            src: 'assets/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
  },
  base: '/MarketGo/', 
})