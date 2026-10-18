import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the site works under GitHub Pages' /<repo>/ sub-path
  base: './',
})
