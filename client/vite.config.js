// client/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🛑 ADD THIS SERVER CONFIGURATION BLOCK 🛑
  server: {
    proxy: {
      // Proxy requests starting with /api to the backend server
      '/api': {
        target: 'http://localhost:8080', // Your Node.js server address
        changeOrigin: true, // Needed for virtual hosting
        secure: false, // For local development (not using HTTPS)
      }
    }
  }
});