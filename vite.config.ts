import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'RunTracker',
        short_name: 'RunTracker',
        description: 'Planifica y mide tus rutas de running.',
        theme_color: '#17221f',
        background_color: '#f5f6f0',
        display: 'standalone',
        start_url: '/',
        icons: [],
      },
    }),
  ],
})
