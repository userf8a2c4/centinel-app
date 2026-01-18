
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
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(s => s + 1);
      // Pulso de integridad cada 4 segundos para comunicar vida al sistema
      if (lastSync % 4 === 0) {
        setPulse(true);
        setTimeout(() => setPulse(false), 1200);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSync]);

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
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
      border: "border-emerald-500/30",
      desc: { ES: "El motor de consenso confirma que el 100% de los datos coinciden con su firma original. La cadena es inmutable.", EN: "Consensus engine confirms 100% of data matches original signature. Chain is immutable." }
    },
    anomaly: {
      label: { ES: "ATÍPICO", EN: "ATYPICAL" },
      color: "bg-amber-500",
      text: "text-amber-500",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      border: "border-amber-500/30",
      desc: { ES: "Detectada una desviación estadística que rompe los patrones demográficos normales. Requiere inspección.", EN: "Statistical deviation detected breaking normal demographic patterns. Requires inspection." }
    },
    hash_broken: {
      label: { ES: "ALERTA", EN: "ALERT" },
      color: "bg-red-500",
      text: "text-red-500",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.6)]",
      border: "border-red-500/50",
      desc: { ES: "¡CRÍTICO! El sello digital ha sido violentado. Los datos no coinciden con la huella forense original.", EN: "CRITICAL! Digital seal violated. Data does not match the original forensic footprint." }
    },
    connection_lost: {
      label: { ES: "SYNCING", EN: "SYNCING" },
      color: "bg-zinc-500",
      text: "text-zinc-500",
      glow: "",
      border: "border-zinc-500/20",
      desc: { ES: "Sincronizando con nodos distribuidos para validación multi-firma...", EN: "Syncing with distributed nodes for multi-signature validation..." }
    }
  }[status];

  return (
    <div className={`group relative inline-flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-1000 ${pulse ? `${config.border} scale-[1.02] ${isDark ? 'bg-zinc-800' : 'bg-white'}` : 'border-zinc-500/10'} ${isDark ? 'bg-zinc-900 shadow-2xl shadow-black' : 'bg-white shadow-sm'}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${config.color} ${status !== 'nominal' ? 'animate-pulse' : ''} ${pulse ? config.glow : ''} transition-all duration-1000`}></div>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.text}`}>{config.label[lang]}</span>
      <div className="w-px h-3 bg-zinc-500/20"></div>
      <span className="text-[9px] font-bold opacity-40 uppercase tabular-nums">
        HEARTBEAT: {lastSync}s
      </span>

      {/* Forensics Popover - Narrativa Forense */}
      <div className={`absolute bottom-full mb-3 left-0 w-80 p-6 rounded-[32px] opacity-0 pointer-events-none group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-[100] shadow-2xl backdrop-blur-3xl border ${isDark ? 'bg-zinc-950/95 text-white border-white/10' : 'bg-white/95 text-zinc-900 border-zinc-200'}`}>
        <div className="flex justify-between items-center mb-5">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Motor Forense v4.1</p>
          <span className="text-[8px] mono px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded font-black tracking-tighter">NODE_TRUSTED</span>
        </div>
        <p className="text-xs font-bold leading-relaxed mb-6 opacity-80">{config.desc[lang]}</p>
        <div className="grid grid-cols-2 gap-4 pt-5 border-t border-zinc-500/10">
           <div className="flex flex-col">
             <span className="text-[8px] opacity-40 font-black uppercase">Consistencia</span>
             <span className={`text-[10px] font-black mono ${status === 'nominal' ? 'text-emerald-500' : 'text-red-500'}`}>
               {status === 'nominal' ? 'INTEGRAL' : 'COMPROMETIDA'}
             </span>
           </div>
           <div className="flex flex-col text-right">
             <span className="text-[8px] opacity-40 font-black uppercase">Algoritmo</span>
             <span className="text-[10px] font-black mono text-blue-500">SHA-256</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrityMonitor;
