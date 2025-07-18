import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './', // مسیر پایه را به './' نگه می‌داریم تا با GitHub Pages سازگار باشد.

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
      // [G_REASONING] **تنظیمات Build جدید:**
      // [G_REASONING] **assetsDir: '.'** : این باعث می‌شود که فایل‌های JS/CSS مستقیماً در ریشه 'dist' قرار گیرند، نه در 'dist/assets'.
      // [G_REASONING] **rollupOptions.output.entryFileNames: '[name].js'** : نام فایل‌های خروجی را ساده می‌کند.
      // [G_REASONING] **rollupOptions.output.chunkFileNames: '[name].js'** : نام فایل‌های chunk شده را ساده می‌کند.
      assetsDir: '.', 
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          // [G_REASONING] این خط مطمئن می‌شود که فایل‌های Build شده مسیرشان با base path شروع می‌شود.
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'index.css') { // [G_REASONING] اگر index.css وجود داشته باشد
              return 'index.css'; // [G_REASONING] نام آن را index.css نگه می‌داریم
            }
            return '[name].[ext]'; // [G_REASONING] بقیه asset‌ها نامشان را حفظ کنند
          },
        },
      },
    },
  };
});