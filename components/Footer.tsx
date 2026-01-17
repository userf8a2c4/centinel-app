
import React from 'react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = {
    ES: {
      subtitle: "CENTINEL es un esfuerzo ciudadano por la transparencia electoral.",
      disclaimerTitle: "TRANSPARENCIA RADICAL",
      disclaimerText: "Análisis basado en datos públicos del CNE procesados mediante hashing SHA-256.",
      rights: "© 2026 PROYECTO CENTINEL",
      terms: "Términos",
      privacy: "Privacidad",
      method: "Metodología"
    },
    EN: {
      subtitle: "CENTINEL is a citizen effort for electoral transparency.",
      disclaimerTitle: "RADICAL TRANSPARENCY",
      disclaimerText: "Analysis based on public CNE data processed via SHA-256 hashing.",
      rights: "© 2026 PROJECT CENTINEL",
      terms: "Terms",
      privacy: "Privacy",
      method: "Methodology"
    }
  }[lang];

  return (
    <footer className="mt-auto py-10 md:py-16 border-t border-slate-700/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-1.5 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
             </div>
             <span className="font-black text-xl tracking-tighter uppercase">CENTINEL</span>
          </div>
          <p className="text-slate-500 font-bold text-xs leading-relaxed max-w-xs">{t.subtitle}</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-700/10 bg-slate-500/5 space-y-3">
           <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">{t.disclaimerTitle}</h5>
           <p className="text-[11px] font-bold text-slate-500 italic">"{t.disclaimerText}"</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-10 mt-10 border-t border-slate-700/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-6">
         <span>{t.rights}</span>
         <div className="flex gap-6 md:gap-10">
            <span className="cursor-pointer hover:text-blue-500 transition-colors">{t.terms}</span>
            <span className="cursor-pointer hover:text-blue-500 transition-colors">{t.privacy}</span>
            <span className="cursor-pointer hover:text-blue-500 transition-colors">{t.method}</span>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
