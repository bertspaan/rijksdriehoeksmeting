import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: process.env.PUBLIC_PATH || '/rijksdriehoeksmeting/',
  plugins: [vue()],
  build: {
    rolldownOptions: {
      input: {
        standalone: fileURLToPath(new URL('./index.html', import.meta.url)),
        client: fileURLToPath(new URL('./tentoonstelling/index.html', import.meta.url)),
        display: fileURLToPath(new URL('./tentoonstelling/display/index.html', import.meta.url))
      }
    }
  }
})
