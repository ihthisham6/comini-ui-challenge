import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Resolves '@' to 'src'
    },
  },
  server: {
    watch: {
      usePolling: true, // Helps with Windows file system issues
    },
  },
  optimizeDeps: {
    include: ['vue'] // Make sure Vue is pre-optimized
  }
});
