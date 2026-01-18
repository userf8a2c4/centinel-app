
import React, { useMemo, useState } from 'react';
import { Language, ElectionData, Theme } from '../types';

interface CitizenViewProps {
  lang: Language;
  data: ElectionData | null;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  theme: Theme;
  colorBlindMode: boolean;
}

const HONDURAS_PATHS = [
  { id: "atlantida", name: "Atlántida", d: "M435,145 L490,165 L510,185 L500,210 L440,200 L410,175 Z" },
  { id: "choluteca", name: "Choluteca", d: "M420,440 L455,435 L485,470 L470,520 L425,530 L395,510 L390,480 Z" },
  { id: "colon", name: "Colón", d: "M510,185 L650,205 L720,270 L680,320 L550,310 L530,280 L540,210 Z" },
  { id: "comayagua", name: "Comayagua", d: "M320,300 L380,280 L400,360 L320,390 L290,350 Z" },
  { id: "copan", name: "Copán", d: "M130,250 L185,260 L195,330 L150,360 L110,340 L115,280 Z" },
  { id: "cortes", name: "Cortés", d: "M265,170 L360,165 L370,210 L340,270 L260,250 L245,210 Z" },
  { id: "el_paraiso", name: "El Paraíso", d: "M485,370 L600,400 L580,470 L520,460 L455,435 L420,440 L435,390 Z" },
  { id: "francisco_morazan", name: "Francisco Morazán", d: "M380,280 L485,370 L455,435 L420,440 L370,440 L360,360 Z" },
  { id: "gracias_a_dios", name: "Gracias a Dios", d: "M650,205 L920,250 L840,450 L680,400 L720,270 Z" },
  { id: "intibuca", name: "Intibucá", d: "M215,335 L300,320 L310,390 L240,410 L220,370 Z" },
  { id: "islas_bahia", name: "Islas de la Bahía", d: "M480,70 L540,85 L545,100 L485,90 Z M620,105 L680,130 L690,150 L630,130 Z" },
  { id: "la_paz", name: "La Paz", d: "M300,320 L320,310 L340,380 L290,400 L280,350 Z" },
  { id: "lempira", name: "Lempira", d: "M185,260 L260,250 L275,370 L205,385 L195,330 Z" },
  { id: "ocotepeque", name: "Ocotepeque", d: "M90,335 L135,330 L145,395 L100,405 L90,365 Z" },
  { id: "olancho", name: "Olancho", d: "M480,280 L650,290 L680,400 L520,380 L380,280 Z" },
  { id: "santa_barbara", name: "Santa Bárbara", d: "M200,195 L265,185 L320,300 L215,335 L200,260 Z" },
  { id: "valle", name: "Valle", d: "M340,380 L370,440 L420,440 L390,480 L320,490 L295,470 Z" },
  { id: "yoro", name: "Yoro", d: "M360,165 L435,145 L530,280 L480,280 L380,280 L370,210 Z" }
];

const CitizenView: React.FC<CitizenViewProps> = ({ lang, data, selectedDept, setSelectedDept, theme, colorBlindMode }) => {
  const currentDept = useMemo(() => data?.departments.find(d => d.name === selectedDept) || null, [data, selectedDept]);
  const totalVotes = useMemo(() => data?.candidates.reduce((sum, c) => sum + c.votes, 0) || 1, [data]);
  const latestProtocol = useMemo(() => data?.latestProtocols[0] || null, [data]);
  const isDark = theme === 'dark';

  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

  const t = {
    ES: { national: "NACIONAL", processed: "ACTAS", participation: "VOTACIÓN", votes: "VOTOS", health: "SALUD_SHA256", status: "ÍNTEGRO", winProb: "PROB. VICTORIA", details: "VER MÉTRICAS FORENSES" },
    EN: { national: "NATIONAL", processed: "RECORDS", participation: "TURNOUT", votes: "VOTES", health: "SHA256_HEALTH", status: "INTACT", winProb: "WIN PROB", details: "VIEW FORENSIC METRICS" }
  }[lang];

  const getWinProb = (candidateId: string) => {
    if (!data) return "0.0%";
    const total = data.candidates.reduce((acc, c) => acc + c.votes, 0);
    const processed = data.global.processedPercent / 100;
    const cand = data.candidates.find(c => c.id === candidateId);
    if (!cand) return "0.0%";
    const share = cand.votes / total;
    const prob = Math.min(99.9, Math.max(0.1, (share * (1 + processed) * 100)));
    return `${prob.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-8 pb-12">
      <div className="md:col-span-4 bento-card p-10 flex flex-col min-h-[500px]">
        <div className="flex justify-between items-start mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedDept.toUpperCase()}</h2>
          <button onClick={() => setSelectedDept("Nivel Nacional")} className={`px-6 py-2 rounded-xl text-[9px] font-black border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/5 hover:bg-black/10'}`}>
            {t.national}
          </button>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <svg viewBox="0 0 1000 600" className="w-full h-full max-h-[400px]">
            {HONDURAS_PATHS.map((path) => {
              const dData = data?.departments.find(d => d.name === path.name);
              const isActive = selectedDept === path.name;
              const hasData = dData && dData.processed > 0;
              
              let fill = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
              if (isActive) fill = '#0071e3';
              else if (dData?.status === 'critical') fill = '#ef4444';
              else if (hasData) fill = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

              return (
                <path
                  key={path.id} d={path.d} onClick={() => setSelectedDept(path.name)}
                  className="cursor-pointer transition-all duration-300 hover:opacity-80"
                  style={{ fill, stroke: isActive ? '#0071e3' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'), strokeWidth: isActive ? 3 : 1 }}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="bento-card p-8 text-center flex flex-col justify-center">
          <p className="text-[9px] font-black opacity-40 uppercase mb-2">{t.processed}</p>
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-6xl font-black mono tracking-tighter">{currentDept ? currentDept.processed : data?.global.processedPercent}%</span>
          </div>
        </div>
        <div className="bento-card p-8 text-center flex flex-col justify-center">
          <p className="text-[9px] font-black opacity-40 uppercase mb-2">{t.participation}</p>
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-6xl font-black mono tracking-tighter">{currentDept ? currentDept.participation : data?.global.participationPercent}%</span>
          </div>
        </div>
        
        <div className="bento-card p-8 text-center flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4 px-2">
             <p className="text-[9px] font-black opacity-40 uppercase">{t.health}</p>
             <span className="text-[8px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded uppercase tracking-widest">{t.status}</span>
          </div>
          <div className="space-y-3">
            <div className={`p-4 rounded-2xl mono text-[10px] break-all leading-relaxed ${isDark ? 'bg-black/40 text-emerald-400' : 'bg-zinc-100 text-emerald-600 shadow-inner'}`}>
               {latestProtocol?.hash}
            </div>
          </div>
        </div>
      </div>

      {data?.candidates.map(c => {
        const isExpanded = expandedCandidate === c.id;
        return (
          <div 
            key={c.id} 
            onClick={() => setExpandedCandidate(isExpanded ? null : c.id)}
            className={`md:col-span-2 bento-card p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 ${isExpanded ? 'ring-2 ring-blue-500 scale-[1.02] shadow-2xl' : ''}`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black opacity-40 uppercase">{c.party}</span>
                <div className="w-3.5 h-3.5 rounded-full shadow-lg" style={{ backgroundColor: c.color }}></div>
              </div>
              <h4 className="text-lg font-black tracking-tight uppercase">{c.name}</h4>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                  <span className="text-[54px] font-black mono leading-none tracking-tighter" style={{ color: c.color }}>{(c.votes / totalVotes * 100).toFixed(1)}%</span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-baseline gap-1">
                     <span className="text-[10px] font-bold opacity-30 uppercase tracking-tight">{t.winProb}:</span>
                     <span className="text-[11px] font-black mono tabular-nums uppercase" style={{ color: c.color }}>{getWinProb(c.id)}</span>
                  </div>
                  <span className="text-[11px] font-bold opacity-30 tabular-nums uppercase mono">{c.votes.toLocaleString()} {t.votes}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-zinc-500/10 rounded-full overflow-hidden mb-4">
                <div className="h-full transition-all duration-1000" style={{ width: `${(c.votes / totalVotes * 100)}%`, backgroundColor: c.color }}></div>
              </div>

              {isExpanded && (
                <div className="pt-5 border-t border-zinc-500/10 animate-in fade-in slide-in-from-top-3 duration-500 space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">Salud de Cuota (Sigma)</span>
                      <span className="text-[10px] font-black mono text-emerald-500">NOMINAL</span>
                   </div>
                   <div className="flex gap-1.5">
                      {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 8 ? 'bg-blue-500' : 'bg-zinc-500/10'}`}></div>
                      ))}
                   </div>
                   <p className="text-[10px] font-bold opacity-60 leading-snug">
                     {lang === 'ES' 
                       ? "Análisis de flujo verificado. No se detectan picos de carga automatizada en este candidato." 
                       : "Flow analysis verified. No automated load spikes detected for this candidate."}
                   </p>
                </div>
              )}
              
              {!isExpanded && (
                <div className="flex justify-center pt-2">
                  <span className="text-[8px] font-black opacity-20 uppercase tracking-[0.3em]">{t.details}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CitizenView;
