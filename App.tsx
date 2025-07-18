import React, { useState, useCallback, useEffect } from 'react';
import { Language } from './types';
import { LANGUAGES } from './constants';
import { translateText } from './services/geminiService';
import LanguageSelector from './components/LanguageSelector';
import TextArea from './components/TextArea';
import { ArrowRightLeftIcon, ClipboardIcon, ClipboardCheckIcon, LoaderIcon } from './components/icons';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<Language>(LANGUAGES[0]); // 'auto'
  const [targetLang, setTargetLang] = useState<Language>(LANGUAGES.find(l => l.code === 'en') || LANGUAGES[1]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOutputText('');

    try {
      const result = await translateText(inputText, targetLang);
      setOutputText(result);
    } catch (err) {
      setError('Failed to translate. Please check your connection or API key.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, targetLang]);

  const handleSwapLanguages = () => {
    if (sourceLang.code === 'auto') return;
    setInputText(outputText);
    setOutputText(inputText);
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };
  
  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Debounce translation trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputText) {
        handleTranslate();
      } else {
        setOutputText('');
        setError(null);
      }
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, targetLang]);


  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col items-center p-4 sm:p-6 md:p-10">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
          Gemini AI Translator
        </h1>
        <p className="text-gray-400 mt-2">Instant translations powered by Google's Gemini</p>
      </header>
      
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-1">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 mb-2">
            {/* Source Language Selector (Non-interactive for now) */}
            <div className="w-full md:w-1/2 flex items-center justify-start">
                <div className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium">
                    Detect Language
                </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwapLanguages}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Swap languages"
              disabled={sourceLang.code === 'auto'}
            >
              <ArrowRightLeftIcon className="w-5 h-5" />
            </button>

            {/* Target Language Selector */}
            <div className="w-full md:w-1/2 flex items-center justify-end">
                <LanguageSelector 
                    selectedLang={targetLang} 
                    onSelectLang={setTargetLang} 
                    languages={LANGUAGES.filter(l => l.code !== 'auto')}
                />
            </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Panel */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-1 relative flex flex-col">
            <TextArea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text..."
              readOnly={isLoading}
              dir="auto"
            />
             <div className="text-right text-xs text-gray-500 p-2">{inputText.length} / 5000</div>
          </div>

          {/* Output Panel */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-1 relative flex flex-col">
            <TextArea
              id="output-text"
              value={outputText}
              placeholder="Translation..."
              readOnly
              dir={targetLang.rtl ? 'rtl' : 'ltr'}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl">
                <LoaderIcon className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            )}
            {!isLoading && outputText && (
               <button 
                  onClick={handleCopyToClipboard}
                  className="absolute bottom-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  title="Copy to clipboard"
                >
                  {isCopied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                </button>
            )}
          </div>
        </div>

        {error && (
            <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">
                <p>{error}</p>
            </div>
        )}
      </main>

       <footer className="text-center text-gray-500 mt-10 text-sm">
            <p>&copy; {new Date().getFullYear()} Gemini Translator. Built with React & Tailwind CSS.</p>
        </footer>
    </div>
  );
};

export default App;