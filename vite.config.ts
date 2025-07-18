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
      // [G_REASONING] **تنظیمات Build برای تزریق نام Asset به index.html (مهمترین بخش):**
      // [G_REASONING] این باعث می‌شود Vite یک فایل index.html تولید کند که به صورت خودکار به فایل‌های JS/CSS Build شده اشاره کند.
      assetsDir: 'assets', // [G_REASONING] فایل‌ها را در پوشه 'assets' داخل 'dist' قرار می‌دهد.
      rollupOptions: {
        output: {
          // [G_REASONING] نام‌های فایل‌های Build شده را به صورت استاندارد Vite با هش تولید می‌کند
          entryFileNames: `[name]-[hash].js`,
          chunkFileNames: `[name]-[hash].js`,
          assetFileNames: `[name]-[hash].[ext]`,
        },
      },
      // [G_REASONING] **مهم:** فایل HTML را بهینه سازی کنید تا Vite خودش اسکریپت‌ها را تزریق کند
      minify: 'terser', // [G_REASONING] یا 'esbuild'
      emptyOutDir: true, // [G_REASONING] پوشه dist را قبل از Build پاک می‌کند
    },
  };
});