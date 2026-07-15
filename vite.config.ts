import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  publicDir: 'images',
  build: {
    target: 'es2022',
  },
})
