import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // این خط برای پروژه‌های React ضروری است

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', ''); // بارگذاری متغیرهای محیطی از فایل .env
  return {
    // تنظیم base برای GitHub Pages:
    // این مسیر باید با نام مخزن GitHub شما مطابقت داشته باشد.
    // نام مخزن شما "gemini-ai-translator" است.
    base: '/gemini-ai-translator/',

    // پلاگین‌های Vite:
    // برای پروژه‌های React، استفاده از پلاگین @vitejs/plugin-react ضروری است.
    plugins: [react()],

    // تنظیمات برای تزریق متغیرهای محیطی به کد سمت کلاینت:
    // این بخش کلید API جمینای شما را از متغیرهای محیطی به برنامه تزریق می‌کند.
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    // تنظیمات برای Alias (مسیرهای کوتاه):
    // این بخش به شما امکان می‌دهد از '@/' برای ارجاع به ریشه پروژه استفاده کنید.
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});