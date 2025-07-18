import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // [G_REASONING] مسیر پایه (base path) برای دیپلوی به GitHub Pages اصلاح شد.
    // [G_REASONING] './' باعث می‌شود Vite مسیرهای Asset را نسبت به index.html محاسبه کند.
    base: './',

    plugins: [
      react(),
      // [G_REASONING] این پلاگین CSS را به صورت جداگانه Build می‌کند.
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
      // [G_REASONING] **تنظیمات Build برای تزریق نام Asset به index.html:**
      // [G_REASONING] این باعث می‌شود Vite یک فایل index.html تولید کند که به صورت خودکار به فایل‌های JS/CSS Build شده اشاره کند.
      assetsDir: 'assets', // [G_REASONING] فایل‌ها را در پوشه 'assets' داخل 'dist' قرار می‌دهد.
      rollupOptions: {
        output: {
          // [G_REASONING] این تنظیمات اطمینان می‌دهد که Vite نام فایل‌های Build شده را در index.html تزریق می‌کند.
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
    },
  };
});