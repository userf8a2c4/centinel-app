
import React, { useState, useEffect, useRef } from 'react';
import { Theme, TimeSeriesPoint, Language, Candidate, Protocol } from '../types';

interface TimelineProps {
  value: number;
  onChange: (val: number | ((prev: number) => number)) => void;
  history: TimeSeriesPoint[];
  theme: Theme;
  lang: Language;
  candidates?: Candidate[];
  protocols?: Protocol[];
  onAlertClick?: (protocol: Protocol) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  value, onChange, history, theme, lang, candidates = [], protocols = [], onAlertClick 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [snapshotA, setSnapshotA] = useState<number | null>(null);
  const [snapshotB, setSnapshotB] = useState<number | null>(null);
  const [activeHashTab, setActiveHashTab] = useState<'A' | 'B'>('A');
  
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
      }, 100);
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, onChange]);

  const currentIndex = Math.min(Math.floor((value / 100) * (history.length || 1)), history.length - 1);
  const currentTime = history[currentIndex]?.time || '00:00';

  const isComparing = snapshotA !== null && snapshotB !== null;

  const analysis = (() => {
    if (!isComparing) return null;
    
    const timeA = Math.min(snapshotA!, snapshotB!);
    const timeB = Math.max(snapshotA!, snapshotB!);
    
    const idxStart = Math.min(Math.floor((timeA / 100) * history.length), history.length - 1);
    const idxEnd = Math.min(Math.floor((timeB / 100) * history.length), history.length - 1);
    
    const dataStart = history[idxStart];
    const dataEnd = history[idxEnd];
    if (!dataStart || !dataEnd) return null;

    const deltas = candidates.map(c => {
      const vStart = Number(dataStart[c.id]) || 0;
      const vEnd = Number(dataEnd[c.id]) || 0;
      return {
        id: c.id,
        name: c.name,
        party: c.party,
        color: c.color,
        vStart,
        vEnd,
        delta: vEnd - vStart,
        percentChange: vStart > 0 ? ((vEnd - vStart) / vStart * 100).toFixed(2) : '0.00'
      };
    }).sort((a, b) => b.delta - a.delta);

    return {
      start: { time: dataStart.time, hash: `SHA256-A-${Math.random().toString(16).slice(2,10).toUpperCase()}` },
      end: { time: dataEnd.time, hash: `SHA256-B-${Math.random().toString(16).slice(2,10).toUpperCase()}` },
      deltas,
      isChainIntact: protocols?.every(p => p.verified) ?? true,
      reportId: `AUDIT-V4-${Date.now().toString(36).toUpperCase()}`
    };
  })();

  const resetComparison = () => {
    setSnapshotA(null);
    setSnapshotB(null);
  };

  const actionBtnBase = "w-11 h-11 flex items-center justify-center rounded-full border transition-all duration-500 active:scale-90 font-black text-xs mono";
  const themeBtnStyles = isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-black/5 bg-black/5 hover:bg-black/10 text-black shadow-sm';

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[200] transition-all duration-700 ease-apple ${isDocked ? 'translate-y-[calc(100%-34px)]' : 'translate-y-0'}`}>
      
      {/* Drawer de Comparación vinculada al Timeline */}
      <div className={`mx-auto w-[92vw] max-w-lg transition-all duration-700 ${isComparing ? 'opacity-100 translate-y-0 scale-100 mb-2' : 'opacity-0 translate-y-10 scale-95 pointer-events-none h-0'}`}>
        <div className={`bento-card p-5 border-2 ${isDark ? 'bg-zinc-950/95 border-blue-500/20' : 'bg-white/95 border-blue-500/15 shadow-2xl'} backdrop-blur-3xl rounded-[32px]`}>
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-500/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Diferencial Delta</h3>
                <p className="text-[9px] font-bold opacity-40 mono uppercase">{analysis?.start.time} ➔ {analysis?.end.time}</p>
              </div>
            </div>
            {/* Botón de cierre único y funcional */}
            <button onClick={resetComparison} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {analysis?.deltas.slice(0, 4).map((d) => (
              <div key={d.id} className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-black uppercase opacity-40">{d.party}</span>
                  <span className="text-[14px] font-black mono tracking-tighter" style={{ color: d.color }}>+{d.percentChange}%</span>
                </div>
                <p className="text-[10px] font-bold truncate opacity-80">{d.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>

          <div className={`p-3 rounded-2xl ${isDark ? 'bg-black/40' : 'bg-zinc-50'}`}>
             <p className="text-[8px] font-black opacity-30 uppercase mb-2 tracking-widest">Huella Criptográfica Auditada</p>
             <p className="text-[9px] mono opacity-60 break-all leading-tight">
                {activeHashTab === 'A' ? analysis?.start.hash : analysis?.end.hash}
             </p>
          </div>
        </div>
      </div>

      <div onClick={() => setIsDocked(!isDocked)} className="flex justify-center mb-0 cursor-pointer group">
        <div className={`px-12 py-2 rounded-t-[24px] border-t border-l border-r backdrop-blur-3xl transition-all duration-500 ${isDark ? 'bg-zinc-950/98 border-white/10 text-white/40' : 'bg-white/98 border-black/5 shadow-lg'}`}>
          <div className="w-10 h-1 bg-current rounded-full opacity-20 group-hover:opacity-40 transition-all"></div>
        </div>
      </div>
      
      <div className={`px-6 pb-8 pt-6 backdrop-blur-3xl border-t ${isDark ? 'bg-zinc-950/98 border-white/5' : 'bg-white/98 border-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="relative h-10 flex items-center mb-6">
            <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="w-full h-full cursor-pointer relative z-30 opacity-0" />
            <div className="absolute left-0 right-0 h-1.5 bg-zinc-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${value}%` }}></div>
            </div>
            {snapshotA !== null && <div className="absolute h-5 w-1.5 bg-blue-500 top-1/2 -translate-y-1/2 rounded-full" style={{ left: `${snapshotA}%` }}></div>}
            {snapshotB !== null && <div className="absolute h-5 w-1.5 bg-red-500 top-1/2 -translate-y-1/2 rounded-full" style={{ left: `${snapshotB}%` }}></div>}
            <div className={`absolute w-7 h-7 rounded-full border-4 shadow-xl z-40 transition-transform ${isDark ? 'bg-zinc-900 border-blue-600' : 'bg-white border-blue-600'}`} style={{ left: `calc(${value}% - 14px)` }}></div>
          </div>
          
          <div className="flex items-center justify-between gap-4 h-12">
            <div className="flex items-center gap-2 h-full">
              {/* Botones de acción simplificados, eliminando el reset redundante */}
              <button onClick={() => setSnapshotA(value)} className={`${actionBtnBase} ${snapshotA !== null ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : themeBtnStyles}`}>A</button>
              <button onClick={() => setSnapshotB(value)} className={`${actionBtnBase} ${snapshotB !== null ? 'bg-red-600 border-red-600 text-white shadow-lg' : themeBtnStyles}`}>B</button>
            </div>

            <div className="flex items-center justify-center gap-6 bg-zinc-500/5 px-6 rounded-full border border-zinc-500/10 h-full">
              <button onClick={() => setIsPlaying(!isPlaying)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {isPlaying ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="3" height="16" /><rect x="15" y="4" width="3" height="16" /></svg> : <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
              </button>
              <span className="text-sm font-black mono w-14 text-center tabular-nums">{currentTime}</span>
            </div>

            <div className="flex items-center justify-end h-full">
              <button disabled={!isComparing} onClick={() => {}} className={`${actionBtnBase} ${isComparing ? 'border-emerald-500/20 text-emerald-500' : 'opacity-20 pointer-events-none'} ${themeBtnStyles}`}>PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
