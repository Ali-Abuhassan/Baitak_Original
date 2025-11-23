import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // Allow access from Docker container
    port: 3025,          // Must match docker-compose port
    strictPort: true,
    allowedHosts: [
    "*.ngrok-free.app",
    'qa.yourdomain.com',
    'deposits-ratio-nasa-leone.trycloudflare.com ',
    'hearings-findarticles-hits-crew.trycloudflare.com',
  ],   // Prevent switching ports silently
    watch: {
      usePolling: true,  // Required for hot reload in Docker
      interval: 100,     // Check for file changes every 100ms
    },
  },

})
