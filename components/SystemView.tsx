
import React, { useState } from 'react';
import { Language, Theme } from '../types';

interface SystemViewProps {
  lang: Language;
  theme: Theme;
  colorBlindMode: boolean;
}

const SystemView: React.FC<SystemViewProps> = ({ lang, theme, colorBlindMode }) => {
  const [activeTab, setActiveTab] = useState<'ethos' | 'rules' | 'glossary' | 'diary'>('ethos');
  const isDark = theme === 'dark';

  const t = {
    ES: { 
      tabs: { ethos: "ETHOS", rules: "REGLAS", glossary: "GLOSARIO", diary: "DIARIO" },
      ethos: {
        title: "MANIFIESTO CENTINEL",
        subtitle: "TRANSAPARENCIA RADICAL COMO DEFENSA CÍVICA",
        text: "Centinel no es una herramienta partidaria. Es un nodo de auditoría forense diseñado para que cualquier ciudadano, sin importar su ideología, pueda verificar la integridad de los datos electorales. Nuestra premisa es simple: Sin datos íntegros, no hay democracia. Operamos bajo el principio de 'No confíes, verifica'.",
        pillars: [
          { t: "CRIPTOGRAFÍA", d: "Cada acta está respaldada por un hash SHA-256 inmutable." },
          { t: "CERO DATOS", d: "No recolectamos cookies, IPs ni identidades de auditores." },
          { t: "FORENSE", d: "Algoritmos automáticos detectan anomalías matemáticas en tiempo real." }
        ]
      },
      rules: {
        title: "REGLAS DE CONSENSO",
        items: [
          "1. El sistema solo procesa actas con firma digital verificada.",
          "2. Las anomalías se marcan automáticamente según la Ley de Benford.",
          "3. Un centro se considera 'Crítico' si excede el 95% de participación.",
          "4. Los datos se sincronizan cada 5 minutos con la red descentralizada."
        ]
      },
      glossary: [
        { term: "SHA-256", desc: "Algoritmo criptográfico que genera una huella única para cada documento." },
        { term: "LEY DE BENFORD", desc: "Frecuencia estadística natural de los dígitos en conjuntos de datos numéricos." },
        { term: "OUTLIER", desc: "Punto de dato que se aleja significativamente del promedio del grupo." },
        { term: "CHAIN OF CUSTODY", desc: "Rastreo ininterrumpido del origen de un acta desde su escaneo hasta su indexación." }
      ],
      diary: [
        { date: "30 NOV 2025", event: "Iniciando auditoría de bloque 18,000. Detección de inyección en FM." },
        { date: "29 NOV 2025", event: "Sincronización exitosa de nodos de reserva. Capacidad forense al 100%." }
      ]
    },
    EN: { 
      tabs: { ethos: "ETHOS", rules: "RULES", glossary: "GLOSSARY", diary: "DIARY" },
      ethos: {
        title: "CENTINEL MANIFESTO",
        subtitle: "RADICAL TRANSPARENCY AS CIVIC DEFENSE",
        text: "Centinel is not a partisan tool. It is a forensic audit node designed so that any citizen, regardless of ideology, can verify electoral data integrity. Our premise is simple: Without integral data, there is no democracy. We operate under the 'Don't trust, verify' principle.",
        pillars: [
          { t: "CRYPTOGRAPHY", d: "Each record is backed by an immutable SHA-256 hash." },
          { t: "ZERO DATA", d: "We do not collect cookies, IPs, or auditor identities." },
          { t: "FORENSICS", d: "Automated algorithms detect mathematical anomalies in real-time." }
        ]
      },
      rules: {
        title: "CONSENSUS RULES",
        items: [
          "1. The system only processes records with verified digital signatures.",
          "2. Anomalies are automatically flagged based on Benford's Law.",
          "3. A center is considered 'Critical' if turnout exceeds 95%.",
          "4. Data synchronizes every 5 minutes with the decentralized network."
        ]
      },
      glossary: [
        { term: "SHA-256", desc: "Cryptographic algorithm generating a unique footprint for each document." },
        { term: "BENFORD'S LAW", desc: "Natural statistical frequency of digits in numerical data sets." },
        { term: "OUTLIER", desc: "Data point that deviates significantly from the group average." },
        { term: "CHAIN OF CUSTODY", desc: "Uninterrupted tracking of a record's origin from scanning to indexing." }
      ],
      diary: [
        { date: "NOV 30 2025", event: "Starting audit of block 18,000. Injection detection in FM." },
        { date: "NOV 29 2025", event: "Backup nodes successfully synced. Forensic capacity at 100%." }
      ]
    }
  }[lang];

  return (
    <div className="space-y-8 md:space-y-12 max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="flex justify-center mb-8 md:mb-16">
        <div className={`flex w-full md:w-auto p-1 rounded-full border transition-all duration-500 overflow-x-auto no-scrollbar ${isDark ? 'bg-zinc-900/50 border-white/5 shadow-inner' : 'bg-white border-black/5 shadow-sm'}`}>
          <div className="flex w-full md:w-auto min-w-max">
            {(['ethos', 'rules', 'glossary', 'diary'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 text-[9px] font-black tracking-[0.2em] rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab 
                    ? (isDark ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm' : 'bg-blue-600/10 text-blue-600 border border-blue-500/20 shadow-sm') 
                    : (isDark ? 'text-zinc-500 hover:text-zinc-300 border border-transparent' : 'text-zinc-400 hover:text-zinc-900 border border-transparent')
                }`}
              >
                {t.tabs[tab]}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-2 md:px-0">
         {activeTab === 'ethos' && (
           <div className="space-y-8">
             <div className="bento-card p-8 md:p-16 text-center border-b-4 border-b-blue-600">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{t.ethos.title}</h2>
                <p className="text-[10px] font-black text-blue-500 tracking-[0.3em] mb-10">{t.ethos.subtitle}</p>
                <p className="text-sm md:text-xl opacity-60 leading-relaxed max-w-3xl mx-auto font-medium">{t.ethos.text}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.ethos.pillars.map((p, i) => (
                  <div key={i} className="bento-card p-8">
                    <h4 className="text-[10px] font-black tracking-widest text-blue-500 mb-4">{p.t}</h4>
                    <p className="text-sm font-bold opacity-70">{p.d}</p>
                  </div>
                ))}
             </div>
           </div>
         )}

         {activeTab === 'rules' && (
           <div className="bento-card p-8 md:p-16">
              <h2 className="text-3xl font-black tracking-tighter mb-10">{t.rules.title}</h2>
              <div className="space-y-6">
                {t.rules.items.map((r, i) => (
                  <div key={i} className={`p-6 rounded-3xl border flex items-center gap-6 ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                    <span className="text-2xl font-black text-blue-500">0{i+1}</span>
                    <p className="text-lg font-bold opacity-80">{r}</p>
                  </div>
                ))}
              </div>
           </div>
         )}

         {activeTab === 'glossary' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.glossary.map((g, i) => (
                <div key={i} className="bento-card p-8 group">
                  <h4 className="text-xl font-black tracking-tighter mb-2 group-hover:text-blue-500 transition-colors">{g.term}</h4>
                  <p className="text-sm opacity-60 leading-relaxed font-medium">{g.desc}</p>
                </div>
              ))}
           </div>
         )}

         {activeTab === 'diary' && (
           <div className="bento-card p-8 md:p-16">
              <div className="space-y-12">
                {t.diary.map((d, i) => (
                  <div key={i} className="flex gap-8 relative">
                    {i < t.diary.length - 1 && <div className="absolute left-4 top-10 bottom-[-40px] w-0.5 bg-blue-600/20"></div>}
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 z-10 shadow-lg shadow-blue-500/40">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-blue-500 tracking-widest mono">{d.date}</span>
                      <p className="text-lg font-bold mt-2 opacity-80">{d.event}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default SystemView;
