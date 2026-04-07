import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev.cn/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
});