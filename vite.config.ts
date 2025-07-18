import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // مسیر پایه (base path) برای دیپلوی به GitHub Pages اصلاح شد.
    // این تغییر، مشکل 'Failed to resolve' در زمان Build را حل می‌کند.
    base: './', // از '/gemini-ai-translator/' به './' تغییر یافت.

    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});