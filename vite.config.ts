import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('gsap') || id.includes('canvas-confetti')) {
              return 'animation-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-icons';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200
  }
});
