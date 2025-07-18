
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { ChevronDownIcon } from './icons';

interface LanguageSelectorProps {
  selectedLang: Language;
  onSelectLang: (lang: Language) => void;
  languages: Language[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLang, onSelectLang, languages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (lang: Language) => {
    onSelectLang(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-lg border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedLang.name}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical">
            {languages.map((lang) => (
              <a
                href="#"
                key={lang.code}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(lang);
                }}
                className={`block px-4 py-2 text-sm ${selectedLang.code === lang.code ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                role="menuitem"
              >
                {lang.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
