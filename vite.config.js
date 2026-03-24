import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/course': 'http://localhost:8080',
      '/enrollment': 'http://localhost:8080',
      '/student': 'http://localhost:8080',
      '/schedule': 'http://localhost:8080'
    }
  }
})
