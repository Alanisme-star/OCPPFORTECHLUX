import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    base: '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: isDev
            ? 'http://localhost:8000'
            : 'https://https://ocppfortechlux.onrender.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
