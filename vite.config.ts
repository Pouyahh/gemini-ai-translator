import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // [G_REASONING] **تنظیم base path صحیح برای GitHub Pages با نام مخزن**
    // [G_REASONING] این باعث می‌شود تمام مسیرهای Asset به درستی پیشوند /gemini-ai-translator/ را داشته باشند.
    base: '/gemini-ai-translator/', 

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
      // [G_REASONING] Vite به طور پیش‌فرض assetsDir را روی 'assets' تنظیم می‌کند.
      // [G_REASONING] این تنظیمات خروجی Rollup را برای نام‌گذاری فایل‌ها کنترل می‌کند.
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