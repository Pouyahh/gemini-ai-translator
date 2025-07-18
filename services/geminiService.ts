import { GoogleGenAI } from '@google/genai';
import { Language } from '../types';

// [G_REASONING] **تغییر اصلی:** استفاده از VITE_GEMINI_API_KEY
// [G_REASONING] Vite متغیرهای محیطی که در مرورگر در دسترس هستند را با پیشوند VITE_ تزریق می‌کند.
if (!process.env.VITE_GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

// [G_REASONING] استفاده از VITE_GEMINI_API_KEY برای مقداردهی apiKey
const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

export async function translateText(text: string, targetLanguage: Language): Promise<string> {
    if (!text.trim()) {
        return '';
    }

    const model = "gemini-2.5-flash";
    const prompt = `
        You are an expert translator.
        First, detect the source language of the following text.
        Then, translate the text into ${targetLanguage.name} (language code: ${targetLanguage.code}).
        Provide ONLY the translated text as your response. Do not include any explanations, context, the detected language, or any other conversational text in your output.
        If the input text is already in ${targetLanguage.name}, simply return the original text.
        If you cannot translate the text for any reason, return the original text without any explanation.

        Text to translate:
        "${text}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error('Gemini API call failed:', error);
        throw new Error('Failed to communicate with the translation service.');
    }
}