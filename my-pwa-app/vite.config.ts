import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' 
 
export default defineConfig({
  // Use relative paths so the build works both on project pages and user/org pages
  // (avoids absolute root '/' which can cause 404s when deployed under a sub-path)
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'PWA',
        short_name: 'POC',
        description: 'A React + TypeScript Progressive Web App',
        theme_color: '#00c853',
        background_color: '#00c853',
        display: 'standalone',
         start_url: '/my-pwa-app/',
         scope: '/my-pwa-app/',
        icons: [
          {
            // Use relative paths so manifest works regardless of the hosting path
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ] as any, // ✅ Type assertion fixes overload type mismatch
})
