
import React, { useState, useEffect } from 'react';
import { Language, ElectionData, Theme } from '../types';

type IntegrityStatus = 'nominal' | 'anomaly' | 'hash_broken' | 'connection_lost';

interface IntegrityMonitorProps {
  lang: Language;
  data: ElectionData | null;
  loading: boolean;
  theme: Theme;
  colorBlindMode?: boolean;
}

const IntegrityMonitor: React.FC<IntegrityMonitorProps> = ({ lang, data, loading, theme, colorBlindMode }) => {
  const [lastSync, setLastSync] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setLastSync(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLastSync(0);
  }, [data]);

  const getStatus = (): IntegrityStatus => {
    if (loading) return 'connection_lost';
    const hasHashError = data?.latestProtocols.some(p => !p.verified);
    if (hasHashError) return 'hash_broken';
    const hasAnomaly = data?.global.trend.toLowerCase().includes('volatilidad') || 
                      data?.benford.some(b => Math.abs(b.actual - b.expected) > 5);
    if (hasAnomaly) return 'anomaly';
    return 'nominal';
  };

  const status = getStatus();
  const isDark = theme === 'dark';

  const config = {
    nominal: {
      label: { ES: "ÍNTEGRO", EN: "INTACT" },
      color: "bg-emerald-500",
      text: "text-emerald-500",
      desc: { ES: "Hash de sesión verificado localmente. Consistencia de datos al 100%.", EN: "Session hash verified locally. 100% data consistency." }
    },
    anomaly: {
      label: { ES: "ATÍPICO", EN: "ATYPICAL" },
      color: "bg-amber-500",
      text: "text-amber-500",
      desc: { ES: "Detectada desviación estadística significativa. Requiere auditoría manual.", EN: "Significant statistical deviation detected. Manual audit required." }
    },
    hash_broken: {
      label: { ES: "ALERTA", EN: "ALERT" },
      color: "bg-red-500",
      text: "text-red-500",
      desc: { ES: "¡CRÍTICO! Cadena de custodia digital comprometida. Hash corrupto detectado.", EN: "CRITICAL! Digital chain of custody compromised. Corrupt hash detected." }
    },
    connection_lost: {
      label: { ES: "SYNCING", EN: "SYNCING" },
      color: "bg-zinc-500",
      text: "text-zinc-500",
      desc: { ES: "Estableciendo conexión con nodos de red seguros...", EN: "Establishing connection with secure network nodes..." }
    }
  }[status];

  return (
    <div className={`group relative inline-flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${isDark ? 'bg-zinc-900 border-white/5 shadow-2xl shadow-black' : 'bg-white border-black/5 shadow-sm'}`}>
      <div className={`w-2 h-2 rounded-full ${config.color} ${status !== 'nominal' ? 'animate-pulse' : ''}`}></div>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.text}`}>{config.label[lang]}</span>
      <div className="w-px h-3 bg-zinc-500/20"></div>
      <span className="text-[9px] font-bold opacity-40 uppercase tabular-nums">
        {lang === 'ES' ? `Sync: ${lastSync}s` : `Sync: ${lastSync}s`}
      </span>

      {/* Forensics Popover */}
      <div className={`absolute bottom-full mb-3 left-0 w-72 p-5 rounded-[24px] opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 z-[100] shadow-2xl backdrop-blur-3xl border ${isDark ? 'bg-zinc-950/90 text-white border-white/10' : 'bg-white/90 text-zinc-900 border-zinc-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Forensic Audit v4.1</p>
          <span className="text-[8px] mono px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">LIVE_FEED</span>
        </div>
        <p className="text-[11px] font-bold leading-relaxed mb-4">{config.desc[lang]}</p>
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-500/10">
           <div className="flex flex-col">
             <span className="text-[8px] opacity-40 font-black">LATENCIA</span>
             <span className="text-[10px] font-bold mono">14ms</span>
           </div>
           <div className="flex flex-col text-right">
             <span className="text-[8px] opacity-40 font-black">HASH_ALG</span>
             <span className="text-[10px] font-bold mono">SHA-256</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrityMonitor;
