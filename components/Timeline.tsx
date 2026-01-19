import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Theme, TimeSeriesPoint, Language, Candidate, Protocol } from '../types';

interface TimelineEvent {
  timestamp: string;
  label: string;
  type: "warning" | "critical";
  position: number;
}

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
  const [playSpeed, setPlaySpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [snapshotA, setSnapshotA] = useState<number | null>(null);
  const [snapshotB, setSnapshotB] = useState<number | null>(null);
  
  const playRef = useRef<number | null>(null);
  const isDark = theme === 'dark';

  const events: TimelineEvent[] = [
    { timestamp: "19:30", label: "Spike", type: "critical", position: 35 },
    { timestamp: "23:00", label: "Freeze", type: "warning", position: 72 }
  ];

  useEffect(() => {
    if (isPlaying) {
      playRef.current = window.setInterval(() => {
        onChange((prev: number) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(100, prev + (0.15 * playSpeed));
        });
      }, 30);
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, playSpeed, onChange]);

  const currentIndex = Math.min(Math.floor((value / 100) * (history.length || 1)), history.length - 1);
  const currentTime = history[currentIndex]?.time || '00:00';

  const analysis = useMemo(() => {
    if (snapshotA === null || snapshotB === null) return null;
    const timeStart = Math.min(snapshotA, snapshotB);
    const timeEnd = Math.max(snapshotA, snapshotB);
    
    const idxA = Math.min(Math.floor((timeStart / 100) * history.length), history.length - 1);
    const idxB = Math.min(Math.floor((timeEnd / 100) * history.length), history.length - 1);
    
    const dataA = history[idxA];
    const dataB = history[idxB];
    if (!dataA || !dataB) return null;

    // Filtrar alertas que ocurren dentro del rango de tiempo seleccionado
    const periodAlerts = (protocols || []).filter(p => {
      const pIdx = protocols.indexOf(p);
      const pProgress = (pIdx / Math.max(1, protocols.length)) * 100;
      // Solo alertas (no verificadas) dentro del rango de progreso del timeline
      return pProgress >= timeStart && pProgress <= timeEnd && !p.verified;
    });

    return {
      startTime: dataA.time,
      endTime: dataB.time,
      alerts: periodAlerts,
      deltas: candidates.map(c => {
        const vA = Number(dataA[c.id]) || 0;
        const vB = Number(dataB[c.id]) || 0;
        const diff = vB - vA;
        const pChange = vA > 0 ? (diff / vA) * 100 : 0;
        return { ...c, vA, vB, diff, pChange };
      }).sort((a, b) => b.diff - a.diff)
    };
  }, [snapshotA, snapshotB, history, candidates, protocols]);

  const resetSnapshots = () => {
    setSnapshotA(null);
    setSnapshotB(null);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[300] px-4 md:px-8 pointer-events-none">
      
      <style>{`
        .minimal-slider {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
          cursor: pointer;
          height: 44px;
        }
        .minimal-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #0071e3;
          border: 3px solid ${isDark ? '#1c1c1e' : '#ffffff'};
          box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
          transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
          margin-top: -10px;
        }
        .minimal-slider::-webkit-slider-thumb:active { transform: scale(1.3); }
        .minimal-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};
          border-radius: 2px;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* VENTANA DELTA DINÁMICA - ALTURA INCREMENTADA UN 50% ADICIONAL */}
      <div className={`mx-auto max-w-4xl mb-4 transition-all duration-700 transform ${analysis ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'}`}>
        <div className={`p-4 md:p-6 rounded-[32px] border backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] ${isDark ? 'bg-zinc-950/95 border-white/10' : 'bg-white/95 border-black/5'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">ANÁLISIS DE FLUJO (Tn)</h4>
              <p className="text-sm md:text-lg font-black tracking-tight mono">{analysis?.startTime} ➔ {analysis?.endTime}</p>
            </div>
            <button 
              onClick={resetSnapshots} 
              className="w-8 h-8 rounded-full bg-zinc-500/10 flex items-center justify-center hover:scale-110 active:scale-90 transition-all pointer-events-auto"
            >
              ✕
            </button>
          </div>
          
          {/* Grid de Candidatos - Max-height incrementado un 50% para maximizar visibilidad */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 md:gap-2 overflow-y-auto max-h-[75vh] md:max-h-[82vh] no-scrollbar pr-1 pointer-events-auto">
            {analysis?.deltas.map(d => (
              <div key={d.id} className="p-1.5 md:p-2.5 rounded-xl bg-zinc-500/5 border border-zinc-500/5 flex flex-col justify-between transition-all hover:bg-zinc-500/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
                  <p className="text-[7px] md:text-[8px] font-black truncate uppercase tracking-tighter opacity-70">{d.name}</p>
                </div>
                <div className="leading-none">
                  <p className={`text-[9px] md:text-[11px] font-black mono ${d.pChange > 35 ? 'text-red-500' : (isDark ? 'text-white' : 'text-black')}`}>
                    +{d.diff.toLocaleString()}
                  </p>
                  <p className={`text-[6px] md:text-[7px] font-bold mono opacity-40`}>
                    {d.pChange.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ALERTAS EN EL LAPSO SELECCIONADO */}
          {analysis && analysis.alerts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-500/10">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto">
                <span className="shrink-0 text-[7px] font-black opacity-30 uppercase self-center mr-1">Alertas:</span>
                {analysis.alerts.map(alert => (
                  <button
                    key={alert.id}
                    onClick={() => onAlertClick && onAlertClick(alert)}
                    className="shrink-0 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[7px] font-black mono text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    #{alert.id.split('-').pop()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TIMELINE COMPACTO CON ZOOM */}
      <div className={`mx-auto max-w-3xl pointer-events-auto transition-all duration-500 ${isExpanded ? 'mb-2' : 'mb-0'}`}>
        <div className={`rounded-[30px] border backdrop-blur-3xl shadow-2xl transition-all duration-500 ${isDark ? 'bg-zinc-900/90 border-white/5' : 'bg-white/90 border-black/5'} ${isExpanded ? 'p-5' : 'p-2 px-5'}`}>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all active:scale-90 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {isPlaying ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="3" height="16"/><rect x="15" y="4" width="3" height="16"/></svg> : <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
            </button>

            <div className="relative flex-grow h-10 flex items-center">
              <div className="absolute left-0 right-0 h-1 bg-zinc-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600/50" style={{ width: `${value}%` }}></div>
              </div>

              {events.map((ev, i) => (
                <div 
                  key={`ev-${i}`} 
                  className={`absolute w-1.5 h-1.5 rounded-full top-1/2 -translate-y-1/2 shadow-sm z-20 ${ev.type === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ left: `${ev.position}%` }}
                />
              ))}

              {snapshotA !== null && (
                <div className="absolute w-0.5 h-4 bg-blue-500 top-1/2 -translate-y-1/2 z-20 shadow-sm" style={{ left: `${snapshotA}%` }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-blue-500 bg-white dark:bg-zinc-950 px-1 rounded">A</div>
                </div>
              )}
              {snapshotB !== null && (
                <div className="absolute w-0.5 h-4 bg-red-500 top-1/2 -translate-y-1/2 z-20 shadow-sm" style={{ left: `${snapshotB}%` }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-red-500 bg-white dark:bg-zinc-950 px-1 rounded">B</div>
                </div>
              )}

              <input 
                type="range" min="0" max="100" step="0.01" value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value))} 
                className="minimal-slider relative z-30" 
              />
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-[12px] font-black mono tabular-nums opacity-80 leading-none">{currentTime}</span>
                <span className="text-[7px] font-bold opacity-30 uppercase mt-0.5 tracking-tighter">
                  {history.length > 50 ? 'Scalable Feed' : 'Real-time'}
                </span>
              </div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isExpanded ? 'rotate-180 bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'opacity-20 border-current hover:opacity-100'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 15l7-7 7 7"/></svg>
              </button>
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-20 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-500/10">
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => setSnapshotA(value)} 
                  className={`px-3 py-1.5 rounded-lg border text-[8px] font-black tracking-widest transition-all active:scale-95 ${snapshotA !== null ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'opacity-40 border-current hover:opacity-100'}`}
                >
                  MARCAR A
                </button>
                <button 
                  onClick={() => setSnapshotB(value)} 
                  className={`px-3 py-1.5 rounded-lg border text-[8px] font-black tracking-widest transition-all active:scale-95 ${snapshotB !== null ? 'bg-red-600 text-white border-red-600 shadow-md' : 'opacity-40 border-current hover:opacity-100'}`}
                >
                  MARCAR B
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-500/5 p-1 rounded-xl border border-zinc-500/5">
                <span className="text-[7px] font-black opacity-30 px-2 uppercase tracking-tighter hidden xs:block">SPEED</span>
                {[0.5, 1, 2, 4].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setPlaySpeed(s)}
                    className={`px-2.5 py-1 rounded-md text-[8px] font-black transition-all ${playSpeed === s ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : 'opacity-40 hover:opacity-100'}`}
                  >
                    {s}X
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;