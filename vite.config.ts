import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // [G_REASONING] مسیر پایه (base path) برای دیپلوی به GitHub Pages.
    // [G_REASONING] './' باعث می‌شود Vite مسیرهای Asset را نسبت به index.html محاسبه کند.
    base: './', 

    plugins: [
      react(),
      cssInjectedByJsPlugin()
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // [G_REASONING] **تنظیمات Build برای خروجی Assetها به صورت استاندارد Vite:**
      // [G_REASONING] این باعث می‌شود Vite نام فایل‌های Build شده را در index.html تزریق کند.
      assetsDir: 'assets', // [G_REASONING] فایل‌ها را در پوشه 'assets' داخل 'dist' قرار می‌دهد.
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
      minify: 'terser', 
      emptyOutDir: true, 
    },
  };
});