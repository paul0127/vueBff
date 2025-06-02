import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    federation({
      name: 'host_app',
      remotes: {
        remote_app: 'http://localhost:5174/assets/remoteEntry.js', // 這裡是 remote 的 URL
      },
      shared: ['vue']
    }),
  ],
  server:{
    proxy:{
      '/api':'http://localhost:3001'
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
