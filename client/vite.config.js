import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    port: 1205,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:1205',
        changeOrigin: true,
        secure: false,
      },
    },
    build: {
      rollupOptions: {
        external: ['bootstrap/dist/css/bootstrap.css'], 
      },
    },
  }
})
