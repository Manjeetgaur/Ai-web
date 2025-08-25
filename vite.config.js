import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: when deploying to GitHub Pages, set base to '/<your-repo-name>/'
export default defineConfig({
  plugins: [react()],
  base: '/' // change to '/your-repo-name/' after you know it
})
