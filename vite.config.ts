import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
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
