
import React, { useState, useEffect, useRef } from 'react';
import { Theme, TimeSeriesPoint, Language } from '../types';

interface TimelineProps {
  value: number;
  onChange: (val: number | ((prev: number) => number)) => void;
  history: TimeSeriesPoint[];
  theme: Theme;
  lang: Language;
}

const MILESTONES = [
  { p: 0, label: { ES: "CIERRE", EN: "CLOSE" } },
  { p: 35, label: { ES: "1ER CORTE", EN: "BATCH 1" } },
  { p: 68, label: { ES: "PICO ANÓMALO", EN: "SPIKE" } },
  { p: 100, label: { ES: "FINAL", EN: "FINAL" } }
];

const Timeline: React.FC<TimelineProps> = ({ value, onChange, history, theme, lang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<number | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isPlaying) {
      playRef.current = window.setInterval(() => {
        onChange((prev: number) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 200);
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, onChange]);

  const currentIndex = Math.min(Math.floor((value / 100) * history.length), history.length - 1);
  const currentTime = history[currentIndex]?.time || '00:00';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center px-2">
         <div className="flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]'}`}></div>
           <span className="font-black text-[10px] uppercase tracking-[0.3em] opacity-40">Core_Stream v4.1</span>
         </div>
         <div className={`px-4 py-2 rounded-2xl border font-black mono text-[11px] ${isDark ? 'bg-white/5 border-white/5 text-blue-400' : 'bg-black/5 border-black/5 text-blue-600'}`}>
           {currentTime}
         </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-300 shadow-lg ${isDark ? 'bg-white/5 text-blue-400 hover:bg-white/10 hover:scale-105' : 'bg-black/5 text-blue-600 hover:bg-black/10 hover:scale-105'}`}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="3" height="16" /><rect x="15" y="4" width="3" height="16" /></svg>
          ) : (
            <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        <div className="flex-grow relative pt-6">
          {/* Milestones Labels */}
          <div className="absolute top-0 left-0 right-0 flex justify-between">
            {MILESTONES.map(m => (
              <span key={m.p} className={`text-[8px] font-black uppercase tracking-tighter transition-all duration-500 ${Math.abs(value - m.p) < 5 ? 'text-blue-500 scale-110' : 'opacity-20'}`}>
                {m.label[lang]}
              </span>
            ))}
          </div>

          <div className={`h-1.5 w-full rounded-full relative ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
             {/* Progress Bar */}
             <div className="h-full bg-blue-600 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${value}%` }}></div>
             
             {/* Interaction Range */}
             <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
             
             {/* Custom Thumb */}
             <div className="absolute w-6 h-6 bg-white border-[6px] border-blue-600 rounded-full top-1/2 -translate-y-1/2 pointer-events-none shadow-2xl transition-transform duration-200 group-hover:scale-125" style={{ left: `calc(${value}% - 12px)` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
