import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
 allowedHosts: [
      'fumiko-ungarrisoned-lyndsey.ngrok-free.dev',
    ],    port: 3025,
    // Removed proxy since we're using direct API URL
  },
})
