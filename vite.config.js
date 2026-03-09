import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const allowedHosts = ['jacquie-unevocable-adaline.ngrok-free.dev', '.up.railway.app']

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts,
  },
  plugins: [tailwindcss(), react()],
})
