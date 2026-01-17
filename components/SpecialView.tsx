
import React, { useState } from 'react';
import { Language, ElectionData, Theme } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, ReferenceLine, Label
} from 'recharts';

interface SpecialViewProps {
  lang: Language;
  data: ElectionData | null;
  theme: Theme;
  colorBlindMode: boolean;
}

const SpecialView: React.FC<SpecialViewProps> = ({ lang, data, theme, colorBlindMode }) => {
  const [inspectingId, setInspectingId] = useState<string | null>(null);
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const labelColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';

  const t = {
    ES: {
      metrics: {
        deviation: "DESVIACIÓN DE TENDENCIA",
        inflation: "INFLACIÓN DE CENSO",
        impact: "IMPACTO ESTIMADO",
        votersAffected: "ACTAS BAJO SOSPECHA",
        theoreticalLimit: "LÍMITE EXCEDIDO",
        maxExpected: "MÁXIMO ESPERADO: 72%",
        normal: "VOTO REGULAR",
        special: "FLUJO ATÍPICO",
        alertPerc: "+48% DESVIACIÓN"
      },
      timeline: {
        title: "FLUJO CRÍTICO: DETECCIÓN DE INYECCIÓN",
        spikeLabel: "CARGA MASIVA (12.4K REGISTROS)",
      },
      insights: {
        deviation: "Un flujo atípico indica que los resultados no siguen el comportamiento demográfico del país. Huella digital de manipulación.",
        inflation: "Participación superior al 85% en zonas de alta emigración es indicativo de suplantación de identidad.",
        injection: "El 'Madrugonazo': Procesar miles de actas en milisegundos es físicamente imposible. Indica carga automatizada."
      },
      table: {
        title: "EVIDENCIA FORENSE (LIVE FEED)",
        id: "ID_ACTA",
        time: "STAMP",
        loc: "LOCACIÓN",
        err: "TIPO_ERR",
        action: "INSPECCIONAR"
      },
      modal: {
        source: "CERTIFICADO DE ORIGEN DIGITAL",
        close: "CERRAR AUDITORÍA"
      }
    },
    EN: {
      metrics: {
        deviation: "TREND DEVIATION",
        inflation: "CENSUS INFLATION",
        impact: "ESTIMATED IMPACT",
        votersAffected: "RECORDS UNDER SUSPICION",
        theoreticalLimit: "LIMIT EXCEEDED",
        maxExpected: "MAX EXPECTED: 72%",
        normal: "REGULAR VOTE",
        special: "ATYPICAL FLOW",
        alertPerc: "+48% DEVIATION"
      },
      timeline: {
        title: "CRITICAL FLOW: INJECTION DETECTION",
        spikeLabel: "MASS UPLOAD (12.4K RECORDS)",
      },
      insights: {
        deviation: "Atypical flow indicates results do not follow the country's demographic behavior. Digital manipulation footprint.",
        inflation: "Turnout exceeding 85% in high-emigration areas indicates identity theft.",
        injection: "The 'Midnight Spike': Processing thousands of records in milliseconds is physically impossible. Indicates automated upload."
      },
      table: {
        title: "FORENSIC EVIDENCE (LIVE FEED)",
        id: "RECORD_ID",
        time: "STAMP",
        loc: "LOCATION",
        err: "ERR_TYPE",
        action: "INSPECT"
      },
      modal: {
        source: "DIGITAL ORIGIN CERTIFICATE",
        close: "CLOSE AUDIT"
      }
    }
  }[lang];

  const deviationData = [
    { name: t.metrics.normal, value: 52, fill: '#3b82f6' },
    { name: t.metrics.special, value: 48, fill: '#ef4444' }
  ];

  const injectionData = [
    { time: "01:00", vol: 120 }, { time: "01:30", vol: 135 }, { time: "02:00", vol: 110 },
    { time: "02:30", vol: 145 }, { time: "03:00", vol: 5400 }, { time: "03:30", vol: 125 },
    { time: "04:00", vol: 115 }
  ];

  const records = [
    { id: "ACT-FM-901", time: "03:14:02", loc: "Tegucigalpa, FM", err: "CENSO_EXC", hash: "SHA_9F32...B90" },
    { id: "ACT-CO-442", time: "03:14:05", loc: "San Pedro Sula, CT", err: "BENFORD", hash: "SHA_7C11...D88" },
    { id: "ACT-OL-118", time: "03:14:08", loc: "Juticalpa, OL", err: "HASH_FAIL", hash: "SHA_9A44...E11" },
    { id: "ACT-LE-552", time: "03:14:12", loc: "Gracias, LP", err: "CENSO_EXC", hash: "SHA_2D88...A44" },
  ];

  const AlertCard = ({ title, text }: { title?: string, text: string }) => (
    <div className={`mt-5 p-5 rounded-[24px] border flex gap-4 items-start animate-in slide-in-from-bottom-2 duration-500 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
      <div className="mt-1 shrink-0 text-red-500 animate-pulse">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        {title && <h5 className="text-[10px] font-black uppercase text-red-600 mb-1 tracking-widest">{title}</h5>}
        <p className={`text-[11px] font-bold leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
          {text}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bento-card p-8 flex flex-col min-h-[350px] border-l-4 border-l-red-500">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">{t.metrics.deviation}</h3>
          <div className="flex-grow flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={deviationData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                  {deviationData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-end mt-4">
              <span className="text-[10px] font-black text-zinc-500 uppercase">{t.metrics.special}</span>
              <span className="text-4xl font-black tracking-tighter text-red-600">{t.metrics.alertPerc}</span>
            </div>
          </div>
          <AlertCard text={t.insights.deviation} />
        </div>

        <div className="bento-card p-8 flex flex-col min-h-[350px] border-l-4 border-l-red-500">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">{t.metrics.impact}</h3>
          <div className="flex-grow flex flex-col items-center justify-center">
             <div className="text-center mb-4">
                <span className={`text-6xl font-black tracking-tighter mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>3,812</span>
                <p className="text-[10px] font-black uppercase mt-2 tracking-widest text-red-500">{t.metrics.votersAffected}</p>
             </div>
          </div>
          <AlertCard text={t.insights.inflation} />
        </div>

        <div className="bento-card p-8 flex flex-col min-h-[350px] border-l-4 border-l-red-500">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">{t.metrics.theoreticalLimit}</h3>
          <div className="flex-grow flex flex-col items-center justify-center">
             <div className="text-center mb-4">
                <span className={`text-6xl font-black tracking-tighter mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>94.8%</span>
                <p className="text-[10px] font-black uppercase mt-2 text-red-500 tracking-widest">PARTICIPACIÓN CRÍTICA</p>
                <p className="text-[9px] mono text-zinc-400 mt-2 italic">{t.metrics.maxExpected}</p>
             </div>
          </div>
          <AlertCard text={t.insights.injection} />
        </div>
      </div>

      {/* Main Flow Detection Graph */}
      <div className="bento-card p-6 md:p-10 h-fit flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-500">{t.timeline.title}</h3>
            <p className="text-[10px] font-bold opacity-40 mt-1 uppercase tracking-widest">Análisis de carga por micro-bloques</p>
          </div>
          <span className="text-[9px] font-black px-4 py-2 border-2 border-red-600/50 text-red-600 bg-red-600/10 rounded-full animate-pulse">CARGA_AUTOMATIZADA_DETECTADA</span>
        </div>
        <div className="h-[350px] -ml-8 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={injectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="time" stroke={labelColor} fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{backgroundColor: tooltipBg, border: `2px solid #ef4444`, borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)'}}
                itemStyle={{color: '#ef4444', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase'}}
              />
              <Area type="step" dataKey="vol" stroke="#ef4444" strokeWidth={4} fill="#ef4444" fillOpacity={0.15} />
              <ReferenceLine x="03:00" stroke="#ef4444" strokeDasharray="6 6" strokeWidth={3}>
                <Label value={t.timeline.spikeLabel} position="top" fill="#ef4444" fontSize={11} fontWeight="900" className="mono" offset={15} />
              </ReferenceLine>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="max-w-3xl">
          <AlertCard title="Hallazgo Forense 03:00 AM" text={t.insights.injection} />
        </div>
      </div>

      {/* Evidence Table Section */}
      <div className="bento-card overflow-hidden">
        <div className={`p-6 border-b border-zinc-500/10 flex justify-between items-center ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'}`}>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">{t.table.title}</h3>
          <span className="text-[9px] font-bold px-3 py-1 bg-zinc-500/10 rounded-full text-zinc-500 uppercase tracking-widest">Real-time Scraping</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-500/10">
                <th className="py-5 px-8">{t.table.id}</th>
                <th className="py-5 px-8">{t.table.time}</th>
                <th className="py-5 px-8">{t.table.loc}</th>
                <th className="py-5 px-8">{t.table.err}</th>
                <th className="py-5 px-8 text-right">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-500/5">
              {records.map(r => (
                <tr key={r.id} className={`transition-all duration-300 ${isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-100/50'}`}>
                  <td className="py-5 px-8 text-[11px] mono font-black text-blue-500">{r.id}</td>
                  <td className="py-5 px-8 text-[11px] mono text-zinc-500">{r.time}</td>
                  <td className={`py-5 px-8 text-[11px] font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{r.loc}</td>
                  <td className="py-5 px-8">
                    <span className={`text-[9px] font-black px-2.5 py-1 border-2 rounded-full uppercase ${r.err === 'HASH_FAIL' ? 'border-red-600 text-red-600 bg-red-600/5' : 'border-amber-600 text-amber-600 bg-amber-600/5'}`}>
                      {r.err}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button 
                      onClick={() => setInspectingId(r.id)}
                      className={`px-5 py-2 border-2 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl ${isDark ? 'border-zinc-800 text-zinc-500 hover:text-white hover:border-white/50' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-900 hover:text-white'}`}
                    >
                      {t.table.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Modal */}
      {inspectingId && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-500">
          <div className={`w-full max-w-2xl overflow-hidden border-2 transition-all rounded-[40px] shadow-2xl ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-zinc-200'}`}>
            <div className={`p-8 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-zinc-900' : 'border-zinc-100 bg-zinc-50'}`}>
              <div>
                <h4 className={`text-3xl font-black tracking-tighter mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{inspectingId}</h4>
                <p className="text-[10px] font-black uppercase mt-1 mono text-red-500 tracking-widest">{t.modal.source}</p>
              </div>
              <button onClick={() => setInspectingId(null)} className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${isDark ? 'border-white/20 text-white hover:bg-white hover:text-black' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-900 hover:text-white'}`}>✕</button>
            </div>
            <div className="p-8">
              <div className={`p-8 rounded-[32px] border-2 mono transition-all ${isDark ? 'bg-black border-white/5 text-emerald-400' : 'bg-zinc-50 border-zinc-100 text-emerald-600'}`}>
                <pre className="text-[11px] md:text-[12px] overflow-x-auto leading-relaxed custom-scrollbar">
{`{
  "header": {
    "node_id": "HN-PRIMARY-01",
    "timestamp": "${new Date().toISOString()}",
    "audit_level": "CRITICAL"
  },
  "payload": {
    "record_id": "${inspectingId}",
    "votes_cast": 348,
    "census_limit": 350,
    "anomalies": ["CENSUS_INFLATION_98_PCT", "SHA256_MISMATCH"],
    "raw_hash": "${records.find(r=>r.id===inspectingId)?.hash}"
  },
  "verdict": "DATA_REJECTED"
}`}
                </pre>
              </div>
            </div>
            <div className={`p-8 flex justify-center border-t-2 ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
              <button onClick={() => setInspectingId(null)} className={`px-10 py-4 font-black uppercase tracking-[0.2em] text-[11px] transition-all rounded-full ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
                {t.modal.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialView;
