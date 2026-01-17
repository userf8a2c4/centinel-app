
import React, { useState } from 'react';
import { Language, Theme } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  accessibilityMode: string;
  setAccessibilityMode: (mode: any) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  lang, setLang, theme, setTheme, accessibilityMode, setAccessibilityMode
}) => {
  const [isAccessExpanded, setIsAccessExpanded] = useState(false);
  const isDark = theme === 'dark';

  const t = {
    ES: { code: "CÓDIGO", access: "ACCESIBILIDAD", theme: "TEMA", lang: "IDIOMA" },
    EN: { code: "CODE", access: "ACCESIBILITY", theme: "THEME", lang: "LANGUAGE" }
  }[lang];

  const buttonBaseClass = `w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all border shrink-0 duration-300`;
  const themeStyles = isDark 
    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' 
    : 'border-black/5 bg-black/5 hover:bg-black/10 text-black';

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 md:h-20 backdrop-blur-3xl border-b border-zinc-500/10 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-full flex justify-between items-center gap-4">
        {/* LOGO */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <span className={`font-black text-sm md:text-lg tracking-tighter uppercase ${isDark ? "text-white" : "text-black"}`}>
            CENTINEL
          </span>
        </div>

        {/* CONTROLS - Scrollable on mobile */}
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-2 md:gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${buttonBaseClass} ${themeStyles}`}
              title={t.code}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            <div className={`flex items-center transition-all duration-500 overflow-hidden rounded-full border ${isAccessExpanded ? (isDark ? 'max-w-[200px] md:max-w-[300px] px-1 bg-white/10 border-white/10' : 'max-w-[200px] md:max-w-[300px] px-1 bg-black/5 border-black/5') : 'max-w-[40px] md:max-w-[44px] border-transparent'}`}>
              <button 
                onClick={() => setIsAccessExpanded(!isAccessExpanded)}
                className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all shrink-0 ${isAccessExpanded ? 'rotate-180 text-blue-500' : 'text-zinc-400'}`}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <div className={`flex items-center gap-1 pr-2 ${isAccessExpanded ? 'block' : 'hidden'}`}>
                {['none', 'P', 'D', 'T'].map(m => (
                  <button key={m} className={`w-7 h-7 md:w-8 md:h-8 rounded-full text-[9px] font-black ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{m}</button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
              className={`${buttonBaseClass} ${themeStyles}`}
            >
              <span className="text-[10px] md:text-[11px] font-black uppercase">{lang === 'ES' ? 'EN' : 'ES'}</span>
            </button>

            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')} 
              className={`${buttonBaseClass} ${isDark ? 'bg-black text-white border-white/20' : 'bg-white text-black border-black/10 shadow-sm'}`}
            >
              {isDark ? (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
