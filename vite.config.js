import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use '/Nxt-watch/' only for GitHub Pages, otherwise use '/'
const isGithubPages = process.env.GITHUB_PAGES === 'true';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isGithubPages ? '/Nxt-watch/' : '/',
})
