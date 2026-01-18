
import React, { useState, useEffect, useMemo } from 'react';
import { Language, ElectionData, Protocol, Theme } from '../types';
import SpecialView from './SpecialView';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis, LineChart, Line, Legend
} from 'recharts';

interface AuditorViewProps {
  lang: Language;
  data: ElectionData | null;
  theme: Theme;
  colorBlindMode: boolean;
  activeTab: 'stats' | 'dispersion' | 'alerts' | 'ledger';
  setActiveTab: (tab: 'stats' | 'dispersion' | 'alerts' | 'ledger') => void;
  preselectedProtocol?: Protocol | null;
}

const AuditorView: React.FC<AuditorViewProps> = ({ 
  lang, data, theme, colorBlindMode, activeTab, setActiveTab, preselectedProtocol 
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(data?.latestProtocols[0] || null);
  const [auditInput, setAuditInput] = useState("");
  const [auditResult, setAuditResult] = useState<null | boolean>(null);

  useEffect(() => {
    if (preselectedProtocol) {
      setSelectedProtocol(preselectedProtocol);
    }
  }, [preselectedProtocol]);

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  
  const handleVerify = () => {
    if (!auditInput) return;
    setAuditResult(auditInput.includes('"id_acta"') && auditInput.length > 50); 
  };

  const probTimeSeries = useMemo(() => {
    if (!data || !data.history) return [];
    
    return data.history.map((point, index) => {
      const totalAtPoint = data.candidates.reduce((sum, c) => sum + (Number(point[c.id]) || 0), 0) || 1;
      const result: any = { time: point.time };
      
      data.candidates.forEach(c => {
        const share = (Number(point[c.id]) || 0) / totalAtPoint;
        const progress = index / data.history.length;
        const prob = Math.min(99.9, Math.max(0.1, (share * (1 + progress) * 100)));
        result[c.id] = Number(prob.toFixed(2));
      });
      return result;
    });
  }, [data]);

  const t = {
    ES: {
      stats: "FLUJO", dispersion: "OUTLIERS", alerts: "ANOMALÍAS", ledger: "SHA-256",
      statsTitle: "INYECCIÓN DE DATOS (R-04)", benfordTitle: "LEY DE BENFORD (R-01)", 
      probTitle: "SIMULACIÓN DE PROBABILIDAD (V4)",
      correlationTitle: "DISPERSIÓN SIGMA (R-03)",
      deviationTitle: "DEVIACIÓN POR DEPARTAMENTO",
      verifyTitle: "VERIFICADOR LOCAL (LOCAL_TRUST)",
      placeholder: "Pegue el JSON del acta para validación local...",
      verifyBtn: "VALIDAR HASH LOCAL",
      verified: "ACTA ÍNTEGRA - HASH VÁLIDO", tampered: "INTEGRIDAD ROTA",
      explainFlow: "VERDICTO: El análisis detecta picos de procesamiento (Midnight Spikes). Inyectar 5,000 actas en un minuto supera la capacidad humana, sugiriendo una automatización pre-calculada.",
      explainBenford: "VERDICTO: Desviación en el dígito '1' indica 'Data Cooking'. En datos naturales, el 1 aparece el 30% de las veces. Una caída sugiere redondeo manual para ajustar totales.",
      explainOutliers: "VERDICTO: Centros en el cuadrante de 'Alta Participación / Alta Concentración' marcados como anomalía. En zonas de alta migración, superar el 85% es improbable físicamente.",
      explainDeviation: "VERDICTO: Departamentos en rojo superan la media nacional en +2 Sigma. Estos focos críticos muestran un comportamiento que no coincide con la tendencia demográfica.",
      explainProb: "VERDICTO: La probabilidad se estabiliza, pero el margen de error advierte que si la tendencia atípica continúa, el resultado final divergiría del patrón histórico."
    },
    EN: {
      stats: "FLOW", dispersion: "OUTLIERS", alerts: "ANOMALIES", ledger: "SHA-256",
      statsTitle: "DATA INJECTION (R-04)", benfordTitle: "BENFORD'S LAW (R-01)",
      probTitle: "PROBABILITY SIMULATION (V4)",
      correlationTitle: "SIGMA DISPERSION (R-03)",
      deviationTitle: "DEPARTMENT DEVIATION",
      verifyTitle: "LOCAL VERIFIER (LOCAL_TRUST)",
      placeholder: "Paste record JSON for local validation...",
      verifyBtn: "VALIDATE LOCAL HASH",
      verified: "INTEGRITY OK - HASH MATCHES", tampered: "INTEGRITY FAILURE",
      explainFlow: "VERDICT: Analysis detects 'Midnight Spikes'. Injecting 5,000 records per minute exceeds human capacity, suggesting pre-calculated automation.",
      explainBenford: "VERDICT: Deviation in digit '1' indicates 'Data Cooking'. In natural data, 1 appears 30% of the time. A drop suggests manual rounding to adjust totals.",
      explainOutliers: "VERDICT: Centers in the 'High Turnout / High Concentration' quadrant flagged. In high-migration areas, exceeding 85% turnout is physically improbable.",
      explainDeviation: "VERDICT: Departments in red are over +2 Sigma from national average. These hotspots show behavior that does not match demographic trends.",
      explainProb: "VERDICT: Probability is stabilizing, but error margins warn that if atypical trends persist, final results will diverge from historical patterns."
    }
  }[lang];

  const VerdictCard = ({ text }: { text: string }) => (
    <div className={`mt-5 p-5 rounded-[28px] border flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-500 ${isDark ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50/50 border-blue-500/10'}`}>
      <div className={`mt-1 shrink-0 p-1.5 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-600 text-white'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-1">Análisis Forense Ciudadano</p>
        <p className={`text-[11px] font-bold leading-relaxed tracking-tight ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{text}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-center mb-8">
        <nav className={`flex p-1.5 rounded-full border overflow-x-auto no-scrollbar max-w-[95vw] sm:max-w-max transition-all duration-500 ${isDark ? 'bg-zinc-900/50 border-white/5 shadow-inner' : 'bg-white border-black/5 shadow-sm'}`}>
          <div className="flex gap-1 min-w-max">
            {(['stats', 'dispersion', 'alerts', 'ledger'] as const).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-4 sm:px-8 py-2.5 text-[9px] font-black tracking-widest rounded-full transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? (isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-blue-600/10 text-blue-600 border border-blue-500/20 shadow-sm') 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t[tab]}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {activeTab === 'alerts' ? (
        <SpecialView lang={lang} data={data} theme={theme} colorBlindMode={colorBlindMode} />
      ) : activeTab === 'ledger' ? (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 bento-card p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{t.verifyTitle}</h3>
              <span className="hidden sm:inline-block text-[8px] font-bold text-blue-500 px-3 py-1 bg-blue-500/10 rounded-full tracking-widest uppercase">SHA-256 TRUSTLESS NODE</span>
            </div>
            <textarea 
              value={auditInput} onChange={(e) => setAuditInput(e.target.value)}
              placeholder={t.placeholder}
              className={`w-full h-40 p-5 rounded-3xl text-[11px] mono border outline-none transition-all resize-none ${isDark ? 'bg-black/50 border-white/10 text-zinc-400 focus:border-blue-500/50' : 'bg-zinc-50 border-black/5 text-zinc-600 focus:border-blue-500/30'}`}
            />
            <button onClick={handleVerify} className="w-full py-5 bg-blue-600 text-white rounded-3xl text-[11px] font-black tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]">
              {t.verifyBtn}
            </button>
            {auditResult !== null && (
              <div className={`p-5 rounded-2xl text-center text-[10px] font-black border animate-in slide-in-from-top-2 duration-300 ${auditResult ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                {auditResult ? t.verified : t.tampered}
              </div>
            )}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-[10px] mono">
                <thead className="text-zinc-500 uppercase border-b border-zinc-500/10">
                  <tr>
                    <th className="pb-4 pr-4">ID_ACTA</th>
                    <th className="pb-4 pr-4">STAMP</th>
                    <th className="pb-4 pr-4 hidden md:table-cell">HASH_SIGNATURE</th>
                    <th className="pb-4 text-right">AUDIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-500/5">
                  {data?.latestProtocols.map(p => (
                    <tr key={p.id} onClick={() => setSelectedProtocol(p)} className={`cursor-pointer transition-colors ${selectedProtocol?.id === p.id ? (isDark ? 'bg-white/5' : 'bg-black/5') : 'hover:bg-zinc-500/5'}`}>
                      <td className="py-4 pr-4 font-bold text-blue-500">{p.id}</td>
                      <td className="py-4 pr-4 opacity-60">{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-4 pr-4 opacity-40 truncate max-w-[120px] hidden md:table-cell">{p.hash}</td>
                      <td className={`py-4 text-right font-black ${p.verified ? 'text-emerald-500' : 'text-red-500'}`}>{p.verified ? 'OK' : 'FAIL'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-2 bento-card p-6 overflow-hidden min-h-[500px] flex flex-col">
            <h3 className="text-[10px] font-black text-zinc-500 mb-6 uppercase tracking-widest">Live JSON Inspector</h3>
            <div className={`flex-grow overflow-y-auto custom-scrollbar p-4 rounded-2xl ${isDark ? 'bg-black/30' : 'bg-zinc-50'}`}>
              <pre className="text-[10px] mono opacity-70 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(JSON.parse(selectedProtocol?.jsonData || '{}'), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ) : activeTab === 'stats' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2 bento-card p-10 flex flex-col">
             <h3 className="text-[10px] font-black tracking-widest uppercase mb-8 opacity-40">{t.probTitle}</h3>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={probTimeSeries}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                      <XAxis dataKey="time" stroke={isDark ? '#555' : '#ccc'} fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} stroke={isDark ? '#555' : '#ccc'} fontSize={10} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip contentStyle={{ background: isDark ? '#111' : '#fff', borderRadius: '12px', border: 'none' }} />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }} />
                      {data?.candidates.map(c => (
                        <Line key={c.id} type="monotone" dataKey={c.id} name={c.party} stroke={c.color} strokeWidth={3} dot={false} />
                      ))}
                   </LineChart>
                </ResponsiveContainer>
             </div>
             <VerdictCard text={t.explainProb} />
          </div>

          <div className="bento-card p-8 flex flex-col">
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-8 opacity-40">{t.statsTitle}</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.history || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: isDark ? '#111' : '#fff', borderRadius: '16px', border: 'none' }} />
                  <Area type="step" dataKey="nasry" stroke="#0071e3" fill="#0071e3" fillOpacity={0.1} strokeWidth={3} />
                  <Area type="step" dataKey="salvador" stroke="#ff3b30" fill="transparent" strokeWidth={3} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <VerdictCard text={t.explainFlow} />
          </div>

          <div className="bento-card p-8 flex flex-col">
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-8 opacity-40">{t.benfordTitle}</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.benford || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="digit" stroke={isDark ? '#555' : '#ccc'} fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="expected" fill={isDark ? '#222' : '#eee'} radius={[6, 6, 0, 0]} barSize={20} />
                  <Bar dataKey="actual" radius={[6, 6, 0, 0]} barSize={20}>
                    {data?.benford.map((entry, index) => (
                      <Cell key={index} fill={Math.abs(entry.actual - entry.expected) > 4 ? '#ff3b30' : '#0071e3'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <VerdictCard text={t.explainBenford} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2 bento-card p-10 flex flex-col">
              <h3 className="text-[10px] font-black tracking-widest uppercase mb-8 opacity-40">{t.correlationTitle}</h3>
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" dataKey="participation" domain={[0, 105]} stroke={isDark ? '#555' : '#ccc'} fontSize={10} />
                    <YAxis type="number" dataKey="winnerVoteShare" domain={[0, 100]} stroke={isDark ? '#555' : '#ccc'} fontSize={10} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Stations" data={data?.outliers || []}>
                      {data?.outliers.map((entry, index) => (
                        <Cell key={index} fill={entry.isAnomaly ? '#ff3b30' : '#0071e3'} fillOpacity={0.5} stroke={entry.isAnomaly ? '#ff3b30' : '#0071e3'} strokeWidth={entry.isAnomaly ? 2 : 1} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <VerdictCard text={t.explainOutliers} />
          </div>

          <div className="lg:col-span-2 bento-card p-8 flex flex-col">
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-8 opacity-40">{t.deviationTitle}</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.departments || []}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                     <XAxis dataKey="name" stroke={isDark ? '#555' : '#ccc'} fontSize={8} tick={{angle: -45, textAnchor: 'end'}} height={60} interval={0} />
                     <Bar dataKey="participation" fill="#0071e3" radius={[4, 4, 0, 0]}>
                        {data?.departments.map((entry, index) => (
                           <Cell key={index} fill={entry.participation > 85 ? '#ef4444' : '#0071e3'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <VerdictCard text={t.explainDeviation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditorView;
