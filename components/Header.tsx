
import React, { useState } from 'react';
import { Language, Theme, ElectionData } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  accessibilityMode: string;
  setAccessibilityMode: (mode: any) => void;
  data: ElectionData | null;
}

const Header: React.FC<HeaderProps> = ({ 
  lang, setLang, theme, setTheme, accessibilityMode, setAccessibilityMode, data
}) => {
  const [isAccessExpanded, setIsAccessExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const circleBtn = `w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-500 active:scale-90`;
  const themeStyles = isDark 
    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' 
    : 'border-black/5 bg-black/5 hover:bg-black/10 text-black shadow-sm';

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 md:h-20 backdrop-blur-3xl border-b border-zinc-500/10 transition-all duration-500">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-full flex justify-between items-center">
        
        {/* LOGO - Fixed Left */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <span className={`font-black text-lg tracking-tighter uppercase ${isDark ? "text-white" : "text-black"}`}>
            CENTINEL
          </span>
        </div>

        {/* UTILITIES MENU */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 transition-all duration-500 origin-right ${isMenuOpen ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 translate-x-10 w-0 pointer-events-none overflow-hidden'}`}>
            <a href="https://github.com/centinelasdev/sentinel" target="_blank" rel="noreferrer" className={`${circleBtn} ${themeStyles}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></a >

            <div className="relative">
              <button onClick={() => setIsAccessExpanded(!isAccessExpanded)} className={`${circleBtn} ${themeStyles}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              {isAccessExpanded && (
                <div className={`absolute top-full right-0 mt-3 p-2 rounded-2xl border shadow-2xl animate-in zoom-in-95 min-w-[140px] ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'}`}>
                  {['none', 'protanopia', 'deuteranopia', 'tritanopia', 'high-contrast'].map(mode => (
                    <button key={mode} onClick={() => {setAccessibilityMode(mode); setIsAccessExpanded(false);}} className={`block w-full text-left px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors ${accessibilityMode === mode ? 'text-blue-500' : 'text-zinc-500'}`}>
                      {mode.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')} className={`${circleBtn} ${themeStyles} font-black text-[11px]`}>
              {lang === 'ES' ? 'EN' : 'ES'}
            </button>

            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`${circleBtn} ${themeStyles}`}>
              {isDark ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${circleBtn} ${isMenuOpen ? 'bg-blue-600 border-blue-600 text-white' : (isDark ? 'bg-white/10 border-white/10 text-white' : 'bg-black/5 border-black/5 text-black')}`}>
            {isMenuOpen ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M4 6h16M4 12h16m-7 6h7" /></svg>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
