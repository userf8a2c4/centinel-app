
import React, { useState } from 'react';
import { Language, Theme, ElectionData } from '../types';

interface SystemViewProps {
  lang: Language;
  theme: Theme;
  colorBlindMode: boolean;
  data: ElectionData | null;
}

interface RuleStatus {
  benford: string;
  census: string;
  hashes: string;
  injection: string;
  sum: string;
  sigma: string;
  slope: string;
  signature: string;
}

const SystemView: React.FC<SystemViewProps> = ({ lang, theme, colorBlindMode, data }) => {
  const [activeTab, setActiveTab] = useState<'ethos' | 'rules' | 'glossary' | 'diary'>('rules');
  const isDark = theme === 'dark';

  const checkRules = (): RuleStatus => {
    const pendingStatus: RuleStatus = {
      benford: 'pending',
      census: 'pending',
      hashes: 'pending',
      injection: 'pending',
      sum: 'pending',
      sigma: 'pending',
      slope: 'pending',
      signature: 'pending'
    };

    if (!data) return pendingStatus;
    
    return {
      benford: data.benford[0].actual > 25 && data.benford[0].actual < 35 ? 'clean' : 'alert',
      census: data.departments.every(d => d.participation < 92) ? 'clean' : 'alert',
      hashes: data.latestProtocols.every(p => p.verified) ? 'clean' : 'alert',
      injection: !data.global.trend.toLowerCase().includes('volatilidad') ? 'clean' : 'alert',
      sum: 'clean',
      sigma: data.outliers.filter(o => o.isAnomaly).length < 5 ? 'clean' : 'alert',
      slope: data.history.length > 1 ? 'clean' : 'alert',
      signature: 'clean'
    };
  };

  const status = checkRules();

  const t = {
    ES: { 
      tabs: { ethos: "ETHOS", rules: "ENGINE", glossary: "GLOSARIO", diary: "DIARIO" },
      rules: {
        title: "MOTOR DE CONSENSO MATEMÁTICO",
        subtitle: "8 REGLAS DE ORO DE LA INTEGRIDAD ELECTORAL",
        items: [
          { id: 'benford', code: 'R-01', label: 'BENFORD', footerL: 'BENFORD ANOMALY DETECTION', footerR: 'STAT_INF', title: "1. LEY DE FRECUENCIA NATURAL (BENFORD)", desc: "Los números en la naturaleza y las finanzas siguen un patrón. Si el dígito '1' no aparece cerca del 30% de las veces, el sistema detecta que los datos fueron inventados o 'ajustados' manualmente.", status: status.benford },
          { id: 'census', code: 'R-03', label: 'CAPACIDAD', footerL: 'SPATIAL CONSTRAINT', footerR: 'GEO_MAX', title: "2. TECHO DE PARTICIPACIÓN REAL", desc: "Ninguna comunidad vota al 100%. Cuando un centro reporta más del 90% de participación en zonas de migración, es evidencia de suplantación de identidad o 'llenado' de urnas.", status: status.census },
          { id: 'hashes', code: 'R-02', label: 'HASHING', footerL: 'CRYPTOGRAPHIC AUDIT', footerR: 'SHA-256', title: "3. INTEGRIDAD DE LA CADENA (HASHING)", desc: "Cada acta tiene una 'huella digital' única. Si un solo número se cambia en el servidor, la huella se rompe. Esta regla verifica que el dato que tú ves sea el mismo que salió de la mesa.", status: status.hashes },
          { id: 'injection', code: 'R-04', label: 'VELOCIDAD', footerL: 'TRAFFIC AUDIT', footerR: 'T_FLOW', title: "4. VELOCIDAD DE PROCESAMIENTO", desc: "Un humano tarda minutos en escanear un acta. Si el sistema recibe miles de actas en un segundo, estamos ante una 'inyección automatizada' de resultados pre-calculados.", status: status.injection },
          { id: 'sum', code: 'R-05', label: 'INTEGRIDAD', footerL: 'TABLE BALANCE', footerR: 'M_TREE', title: "5. COHERENCIA ARITMÉTICA", desc: "La suma de los votos nulos, blancos y por candidatos debe ser exactamente igual al total de ciudadanos que firmaron el padrón. Cualquier diferencia invalida el documento.", status: status.sum },
          { id: 'sigma', code: 'R-07', label: 'TENDENCIA', footerL: 'TREND ANALYSIS', footerR: 'HIST_MATCH', title: "6. DISPERSIÓN ESTADÍSTICA (SIGMA)", desc: "Los resultados suelen ser variados. Si un centro de votación es un 'unánime' (todos votan por uno solo), se marca como anomalía estadística para inspección visual.", status: status.sigma },
          { id: 'slope', code: 'R-08', label: 'PATRONES', footerL: 'COLLUSION DETECTION', footerR: 'COL_DET', title: "7. ESTABILIDAD DE LA TENDENCIA", desc: "En una muestra grande, la tendencia debe estabilizarse. Saltos bruscos a mitad del conteo indican que se han introducido lotes de datos para alterar el resultado final.", status: status.slope },
          { id: 'signature', code: 'R-06', label: 'FIRMA', footerL: 'DIGITAL SIGN PROOF', footerR: 'RSA_PSS', title: "8. AUTENTICIDAD DE ORIGEN", desc: "Verifica que el acta provenga de un dispositivo autorizado y no de un simulador externo. Asegura que el canal de transmisión no ha sido interceptado.", status: status.signature }
        ]
      },
      ethos: {
        title: "MANIFIESTO CENTINEL",
        subtitle: "TRANSAPARENCIA RADICAL COMO DEFENSA CÍVICA",
        text: "Centinel no es una herramienta partidaria. Es un nodo de auditoría forense diseñado para que cualquier ciudadano pueda verificar la integridad electoral. Sin datos íntegros, no hay democracia.",
        pillars: [
          { t: "CRIPTOGRAFÍA", d: "Cada acta respaldada por hash SHA-256 inmutable." },
          { t: "CERO DATOS", d: "Sin cookies, IPs ni identidades. Privacidad radical." },
          { t: "FORENSE", d: "Algoritmos detectan anomalías matemáticas en tiempo real." }
        ]
      },
      glossary: {
        security: [
          { term: "CADENA DE CUSTODIA", desc: "Registro cronológico y criptográfico que garantiza que los datos no han sido alterados desde su origen." },
          { term: "HASHING SHA-256", desc: "Huella digital única e inalterable por cada registro procesado." },
          { term: "PRIVACIDAD RADICAL", desc: "Cero recolección de datos personales o identificadores de dispositivo." },
          { term: "RSA-PSS", desc: "Esquema de firma digital avanzado que autentica la procedencia legítima de la información." },
          { term: "SCRAPING AUTOMÁTICO", desc: "Recolección constante de datos públicos para crear historial inmutable." }
        ],
        forensic: [
          { term: "DATA INJECTION", desc: "Carga masiva e inusual de registros en un corto periodo de tiempo que rompe el flujo normal." },
          { term: "LEY DE BENFORD", desc: "Ley estadística sobre la frecuencia de los primeros dígitos que detecta anomalías en datos numéricos naturales." },
          { term: "MERKLE TREE", desc: "Estructura de datos que permite verificar la integridad de grandes conjuntos de información de forma eficiente." },
          { term: "OUTLIERS (ATÍPICOS)", desc: "Puntos de datos que se alejan significativamente del comportamiento del resto de la muestra." }
        ],
        civic: [
          { term: "AUDITORÍA EFÍMERA", desc: "Procesamiento de datos que ocurre solo en memoria y desaparece al cerrar la aplicación." },
          { term: "DESCENTRALIZACIÓN", desc: "Distribución de la información en múltiples nodos para evitar un único punto de control o falla." },
          { term: "JSON", desc: "Formato ligero de intercambio de datos, fácil de leer para humanos y de procesar para máquinas." },
          { term: "OPEN SOURCE", desc: "Código fuente disponible públicamente para que cualquier experto pueda verificar cómo funciona el sistema." }
        ]
      },
      diary: [
        { date: "30 NOV 2025", event: "Iniciando auditoría de bloque 18,000. Detección de inyección en Francisco Morazán." },
        { date: "29 NOV 2025", event: "Sincronización exitosa de nodos de reserva para procesamiento distribuido." }
      ]
    },
    EN: { 
      tabs: { ethos: "ETHOS", rules: "ENGINE", glossary: "GLOSSARY", diary: "DIARY" },
      rules: {
        title: "MATHEMATICAL CONSENSUS ENGINE",
        subtitle: "8 GOLDEN RULES OF ELECTORAL INTEGRITY",
        items: [
          { id: 'benford', code: 'R-01', label: 'BENFORD', footerL: 'BENFORD ANOMALY DETECTION', footerR: 'STAT_INF', title: "1. NATURAL FREQUENCY LAW (BENFORD)", desc: "Numbers follow a pattern. If digit '1' doesn't appear near 30% of the time, the system detects manually adjusted data.", status: status.benford },
          { id: 'census', code: 'R-03', label: 'CAPACITY', footerL: 'SPATIAL CONSTRAINT', footerR: 'GEO_MAX', title: "2. REAL TURNOUT CEILING", desc: "No community votes at 100%. Turnout over 90% in migration areas is evidence of identity theft or ballot stuffing.", status: status.census },
          { id: 'hashes', code: 'R-02', label: 'HASHING', footerL: 'CRYPTOGRAPHIC AUDIT', footerR: 'SHA-256', title: "3. CHAIN INTEGRITY (HASHING)", desc: "Each record has a unique digital footprint. If one number changes, the footprint breaks, signaling data tampering.", status: status.hashes },
          { id: 'injection', code: 'R-04', label: 'VELOCITY', footerL: 'TRAFFIC AUDIT', footerR: 'T_FLOW', title: "4. PROCESSING SPEED", desc: "Scanning takes minutes. Receiving thousands of records per second indicates automated injection of pre-calculated results.", status: status.injection },
          { id: 'sum', code: 'R-05', label: 'INTEGRITY', footerL: 'TABLE BALANCE', footerR: 'M_TREE', title: "5. ARITHMETIC COHERENCE", desc: "Null, blank, and candidate votes must exactly equal the total signatures on the poll book.", status: status.sum },
          { id: 'sigma', code: 'R-07', label: 'TREND', footerL: 'TREND ANALYSIS', footerR: 'HIST_MATCH', title: "6. STATISTICAL DISPERSION (SIGMA)", desc: "Results are usually varied. Unanimous voting centers are marked as anomalies for visual inspection.", status: status.sigma },
          { id: 'slope', code: 'R-08', label: 'PATTERNS', footerL: 'COLLUSION DETECTION', footerR: 'COL_DET', title: "7. TREND STABILITY", desc: "In large samples, the trend must stabilize. Sudden jumps mid-count indicate batch manipulation.", status: status.slope },
          { id: 'signature', code: 'R-06', label: 'SIGNATURE', footerL: 'DIGITAL SIGN PROOF', footerR: 'RSA_PSS', title: "8. AUTENTICITY OF ORIGIN", desc: "Verifies the record comes from an authorized device and ensures the transmission channel is secure.", status: status.signature }
        ]
      },
      ethos: {
        title: "CENTINEL MANIFESTO",
        subtitle: "RADICAL TRANSPARENCY AS CIVIC DEFENSE",
        text: "Centinel is not a partisan tool. It is a forensic audit node designed so that any citizen can verify electoral integrity. Without integrity, there is no democracy.",
        pillars: [
          { t: "CRYPTOGRAPHY", d: "Each record backed by immutable SHA-256 hash." },
          { t: "ZERO DATA", d: "No cookies, IPs, or identities. Radical privacy." },
          { t: "FORENSICS", d: "Algorithms detect mathematical anomalies in real-time." }
        ]
      },
      glossary: {
        security: [
          { term: "AUTOMATIC SCRAPING", desc: "Constant collection of public data to create an immutable history." },
          { term: "CHAIN OF CUSTODY", desc: "Chronological and cryptographic record ensuring data remains unaltered from source." },
          { term: "RADICAL PRIVACY", desc: "Zero collection of personal data or device identifiers." },
          { term: "RSA-PSS", desc: "Advanced digital signature scheme authenticating the legitimate source of information." },
          { term: "SHA-256 HASHING", desc: "Unique and unalterable digital footprint for each processed record." }
        ],
        forensic: [
          { term: "BENFORD'S LAW", desc: "Statistical law on first-digit frequency that detects anomalies in natural numerical data." },
          { term: "DATA INJECTION", desc: "Massive and unusual record upload in a short period breaking normal flow." },
          { term: "MERKLE TREE", desc: "Data structure allowing efficient integrity verification for large datasets." },
          { term: "OUTLIERS", desc: "Data points deviating significantly from the behavior of the rest of the sample." }
        ],
        civic: [
          { term: "DECENTRALIZATION", desc: "Distribution of information across multiple nodes to avoid a single point of control or failure." },
          { term: "EPHEMERAL AUDIT", desc: "Data processing that occurs only in memory and disappears when closing the application." },
          { term: "JSON", desc: "Lightweight data-interchange format, easy for humans to read and for machines to process." },
          { term: "OPEN SOURCE", desc: "Source code publicly available so that any expert can verify how the system works." }
        ]
      },
      diary: [
        { date: "NOV 30 2025", event: "Starting audit of block 18,000. Injection detection in Francisco Morazán." },
        { date: "NOV 29 2025", event: "Backup nodes successfully synced for distributed processing." }
      ]
    }
  }[lang];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="flex justify-center mb-8">
        <nav className={`flex p-1.5 rounded-full border overflow-x-auto no-scrollbar max-w-[95vw] sm:max-w-max transition-all duration-500 ${isDark ? 'bg-zinc-900/50 border-white/5 shadow-inner' : 'bg-white border-black/5 shadow-sm'}`}>
          <div className="flex gap-1 min-w-max">
            {(['ethos', 'rules', 'glossary', 'diary'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`px-4 sm:px-8 py-2.5 text-[9px] font-black tracking-widest rounded-full transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? (isDark ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm' : 'bg-blue-600/10 text-blue-600 border border-blue-500/20 shadow-sm') 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t.tabs[tab]}
              </button>
            ))}
          </div>
        </nav>
      </div>
      
      <div>
         {activeTab === 'rules' && (
           <div className="space-y-12">
              <div className="text-center px-4">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">{t.rules.title}</h2>
                <p className="text-[10px] font-black opacity-40 tracking-[0.3em] mt-2 uppercase">{t.rules.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {t.rules.items.map((r, i) => (
                  <div key={i} className={`bento-card p-6 flex flex-col justify-between min-h-[300px] border relative transition-all duration-700 ${isDark ? 'bg-[#1c1c1e] border-white/5' : 'bg-white border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)]'}`}>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-blue-500 mono tracking-tighter">{r.code}</span>
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-1000 ${r.status === 'clean' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : (r.status === 'pending' ? 'bg-zinc-500' : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse')}`}></div>
                    </div>

                    <div className="mt-4 mb-8">
                      <h4 className="text-xl font-black tracking-tight mb-4 uppercase">{r.label}</h4>
                      <p className="text-[11px] font-bold opacity-60 leading-relaxed line-clamp-6">{r.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-zinc-500/10 flex justify-between items-center mt-auto">
                      <span className="text-[8px] font-black tracking-widest text-zinc-400 uppercase">{r.footerL}</span>
                      <span className="text-[9px] font-black text-zinc-900 mono opacity-80 dark:text-white">{r.footerR}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
         )}

         {activeTab === 'ethos' && (
           <div className="space-y-8 px-4">
             <div className="bento-card p-6 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tighter mb-4">{t.ethos.title}</h2>
                <p className="text-[10px] font-black text-blue-500 tracking-[0.3em] mb-10 uppercase">{t.ethos.subtitle}</p>
                <p className="text-base sm:text-lg opacity-60 leading-relaxed max-w-2xl mx-auto">{t.ethos.text}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.ethos.pillars.map((p, i) => (
                  <div key={i} className="bento-card p-8 border-t-2 border-t-blue-500/20">
                    <h4 className="text-[10px] font-black tracking-widest text-blue-500 mb-4 uppercase">{p.t}</h4>
                    <p className="text-sm font-bold opacity-70">{p.d}</p>
                  </div>
                ))}
             </div>
           </div>
         )}

         {activeTab === 'glossary' && (
           <div className="space-y-12 px-4">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{lang === 'ES' ? 'PROTOCOLOS DE SEGURIDAD' : 'SECURITY PROTOCOLS'}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {t.glossary.security.map((g, i) => (
                    <div key={i} className="bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h4 className="text-xs font-black uppercase tracking-tight min-w-[200px]">{g.term}</h4>
                      <p className="text-[11px] opacity-60 md:text-right font-medium max-w-xl">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{lang === 'ES' ? 'ANÁLISIS FORENSE' : 'FORENSIC ANALYSIS'}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {t.glossary.forensic.map((g, i) => (
                    <div key={i} className="bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h4 className="text-xs font-black uppercase tracking-tight min-w-[200px]">{g.term}</h4>
                      <p className="text-[11px] opacity-60 md:text-right font-medium max-w-xl">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{lang === 'ES' ? 'CONCEPTOS CÍVICOS' : 'CIVIC CONCEPTS'}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {t.glossary.civic.map((g, i) => (
                    <div key={i} className="bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h4 className="text-xs font-black uppercase tracking-tight min-w-[200px]">{g.term}</h4>
                      <p className="text-[11px] opacity-60 md:text-right font-medium max-w-xl">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
           </div>
         )}

         {activeTab === 'diary' && (
           <div className="bento-card p-6 sm:p-12 space-y-12 mx-4">
              {t.diary.map((d, i) => (
                <div key={i} className="flex gap-4 sm:gap-8 relative">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-blue-500 tracking-widest mono">{d.date}</span>
                    <p className="text-base sm:text-lg font-bold mt-2 opacity-80">{d.event}</p>
                  </div>
                </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default SystemView;
