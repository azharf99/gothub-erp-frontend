import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression2';
import 'dotenv/config'

const TARGET_URL = process.env.VITE_TARGET_URL;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), compression({
    algorithm: 'gzip', // Use gzip (default)
    threshold: 10240,  // Minimum file size in bytes to compress (e.g., 10KB)
    deleteOriginalAssets: false, // Optional: delete original uncompressed assets
  }),],
  server: {
    proxy: {
      '/api': {
        target: `${TARGET_URL}`,
        changeOrigin: true,
      },
    },
  },
})
