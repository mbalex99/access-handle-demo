import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/access-handle-demo/', // just for gh-pages
  plugins: [reactRefresh()]
})
