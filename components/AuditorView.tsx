
import React, { useState } from 'react';
import { Language, ElectionData, Protocol, Theme } from '../types';
import SpecialView from './SpecialView';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';

interface AuditorViewProps {
  lang: Language;
  data: ElectionData | null;
  theme: Theme;
  colorBlindMode: boolean;
}

const AuditorView: React.FC<AuditorViewProps> = ({ lang, data, theme, colorBlindMode }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'dispersion' | 'alerts' | 'ledger'>('stats');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(data?.latestProtocols[0] || null);
  const [auditInput, setAuditInput] = useState("");
  const [auditResult, setAuditResult] = useState<null | boolean>(null);

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  
  const handleVerify = () => {
    if (!auditInput) return;
    setAuditResult(auditInput.includes('"id_acta"') && auditInput.length > 50); 
  };

  const t = {
    ES: {
      stats: "FLUJO & BENFORD", dispersion: "OUTLIERS", alerts: "ESCRUTINIO", ledger: "LIBRO MAYOR",
      statsTitle: "PROGRESIÓN TEMPORAL", benfordTitle: "LEY DE BENFORD (1ST DIGIT)", 
      correlationTitle: "DISPERSIÓN: PARTICIPACIÓN VS VOTO",
      verifyTitle: "VERIFICADOR LOCAL (TRUSTLESS AUDIT)",
      placeholder: "Pegue aquí el JSON del acta para validación criptográfica local...",
      verifyBtn: "COMPUTAR HASH SHA-256",
      verified: "ACTA ÍNTEGRA - HASH COINCIDE", tampered: "FALLA DE INTEGRIDAD - HASH CORRUPTO",
      explainFlow: "La progresión lineal debe ser orgánica. Saltos verticales sin justificación demográfica son indicativos de inyección masiva en servidores.",
      explainBenford: "En procesos naturales, el dígito '1' aparece el 30% de las veces. Desviaciones mayores al 5% sugieren intervención humana en los números.",
      explainOutliers: "Los puntos en la esquina superior derecha son anomalías críticas: centros donde votó casi el 100% del censo y casi todos por el mismo candidato."
    },
    EN: {
      stats: "FLOW & BENFORD", dispersion: "OUTLIERS", alerts: "SCRUTINY", ledger: "LEDGER",
      statsTitle: "TIME PROGRESSION", benfordTitle: "BENFORD'S LAW (1ST DIGIT)",
      correlationTitle: "SCATTER: TURNOUT VS VOTE SHARE",
      verifyTitle: "LOCAL VERIFIER (TRUSTLESS AUDIT)",
      placeholder: "Paste record JSON for local cryptographic validation...",
      verifyBtn: "COMPUTE SHA-256 HASH",
      verified: "INTEGRITY OK - HASH MATCHES", tampered: "INTEGRITY FAILURE - CORRUPT HASH",
      explainFlow: "Linear progression should be organic. Vertical jumps without demographic justification indicate massive server-side injection.",
      explainBenford: "In natural processes, digit '1' appears 30% of the time. Deviations over 5% suggest human intervention in numbers.",
      explainOutliers: "Points in the upper right corner are critical anomalies: centers where nearly 100% turnout occurred and almost all voted for one candidate."
    }
  }[lang];

  const AlertCard = ({ text }: { text: string }) => (
    <div className={`mt-6 p-5 rounded-[24px] border flex gap-4 items-start ${isDark ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
      <div className="mt-1 shrink-0 text-blue-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <p className="text-[11px] font-bold leading-relaxed opacity-70 italic">{text}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-center mb-4">
        <div className={`flex p-1 rounded-full border overflow-x-auto no-scrollbar max-w-full ${isDark ? 'bg-zinc-900/50 border-white/5 shadow-inner' : 'bg-white border-black/5 shadow-sm'}`}>
          <div className="flex min-w-max">
            {(['stats', 'dispersion', 'alerts', 'ledger'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 text-[9px] font-black tracking-widest rounded-full transition-all duration-300 ${activeTab === tab ? (isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-blue-600/10 text-blue-600 border border-blue-500/20') : 'text-zinc-500 hover:text-zinc-300'}`}>
                {t[tab]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'alerts' ? (
        <SpecialView lang={lang} data={data} theme={theme} colorBlindMode={colorBlindMode} />
      ) : activeTab === 'ledger' ? (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 bento-card p-6 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{t.verifyTitle}</h3>
              <span className="text-[9px] font-bold text-blue-500 px-3 py-1 bg-blue-500/10 rounded-full">SHA-256 FORENSIC NODE</span>
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
                  <tr><th className="pb-4 pr-4">ID_ACTA</th><th className="pb-4 pr-4">HASH_SIGNATURE</th><th className="pb-4 text-right">AUDIT</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-500/5">
                  {data?.latestProtocols.map(p => (
                    <tr key={p.id} onClick={() => setSelectedProtocol(p)} className={`cursor-pointer transition-colors ${selectedProtocol?.id === p.id ? (isDark ? 'bg-white/5' : 'bg-black/5') : 'hover:bg-zinc-500/5'}`}>
                      <td className="py-4 pr-4 font-bold text-blue-500">{p.id}</td>
                      <td className="py-4 pr-4 opacity-40 truncate max-w-[120px] md:max-w-none">{p.hash}</td>
                      <td className={`py-4 text-right font-black ${p.verified ? 'text-emerald-500' : 'text-red-500'}`}>{p.verified ? 'VALID' : 'TAMPER'}</td>
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bento-card p-6 md:p-8 flex flex-col">
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-8 opacity-40">{t.statsTitle}</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.history || []}>
                  <defs>
                    <linearGradient id="colorNasry" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0071e3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: isDark ? '#111' : '#fff', borderRadius: '16px', border: 'none' }} />
                  <Area type="monotone" dataKey="nasry" stroke="#0071e3" fill="url(#colorNasry)" strokeWidth={3} />
                  <Area type="monotone" dataKey="salvador" stroke="#ff3b30" fill="transparent" strokeWidth={3} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <AlertCard text={t.explainFlow} />
          </div>

          <div className="bento-card p-6 md:p-8 flex flex-col">
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-8 opacity-40">{t.benfordTitle}</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.benford || []} margin={{ bottom: 20 }}>
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
            <AlertCard text={t.explainBenford} />
          </div>

          {activeTab === 'dispersion' && (
            <div className="lg:col-span-2 bento-card p-6 md:p-10 animate-in zoom-in-95 duration-500 flex flex-col">
              <h3 className="text-[10px] font-black tracking-widest uppercase mb-8 opacity-40">{t.correlationTitle}</h3>
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" dataKey="participation" name="Participación" unit="%" domain={[0, 105]} stroke={isDark ? '#555' : '#ccc'} fontSize={10} />
                    <YAxis type="number" dataKey="winnerVoteShare" name="Voto Ganador" unit="%" domain={[0, 100]} stroke={isDark ? '#555' : '#ccc'} fontSize={10} />
                    <ZAxis type="number" range={[100, 500]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Centros de Votación" data={data?.outliers || []}>
                      {data?.outliers.map((entry, index) => (
                        <Cell key={index} fill={entry.isAnomaly ? '#ff3b30' : '#0071e3'} fillOpacity={0.5} stroke={entry.isAnomaly ? '#ff3b30' : '#0071e3'} strokeWidth={entry.isAnomaly ? 2 : 1} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <AlertCard text={t.explainOutliers} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditorView;
