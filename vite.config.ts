import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API || 'http://localhost:3000';
  
  let hmrHost = 'localhost';
  try {
    hmrHost = new URL(apiUrl).hostname;
  } catch (e) {
    console.warn('Could not parse VITE_API for HMR host, defaulting to localhost');
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      hmr: {
        host: hmrHost,
      },
    },
  };
});
