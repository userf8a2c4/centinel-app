
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CitizenView from './components/CitizenView';
import AuditorView from './components/AuditorView';
import SystemView from './components/SystemView';
import Timeline from './components/Timeline';
import IntegrityMonitor from './components/IntegrityMonitor';
import { Language, ViewMode, Theme, Protocol } from './types';
import { useElectionData } from './hooks/useElectionData';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ES');
  const [view, setView] = useState<ViewMode>('citizen');
  const [theme, setTheme] = useState<Theme>('dark');
  const [accessibilityMode, setAccessibilityMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast'>('none');
  const [selectedDept, setSelectedDept] = useState<string>("Nivel Nacional");
  const [timeCursor, setTimeCursor] = useState<number>(100); 
  const [targetProtocol, setTargetProtocol] = useState<Protocol | null>(null);
  const [auditorSubTab, setAuditorSubTab] = useState<'stats' | 'dispersion' | 'alerts' | 'ledger'>('stats');
  
  const { data, loading } = useElectionData();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${theme}-theme`);
  }, [theme]);

  const filteredData = useMemo(() => {
    if (!data) return null;
    const historyCount = data.history.length;
    const limitIndex = Math.max(1, Math.floor((timeCursor / 100) * historyCount));
    const historySlice = data.history.slice(0, limitIndex);
    const lastPoint = historySlice[historySlice.length - 1];
    
    return {
      ...data,
      candidates: data.candidates.map(c => ({
        ...c,
        votes: (lastPoint[c.id] as number) || 0,
      })),
      history: historySlice,
      global: {
        ...data.global,
        processedPercent: Number((data.global.processedPercent * (timeCursor / 100)).toFixed(1)),
        participationPercent: Number((data.global.participationPercent * (timeCursor / 100)).toFixed(1))
      }
    };
  }, [data, timeCursor]);

  const handleAlertJump = (protocol: Protocol) => {
    setView('auditor');
    setAuditorSubTab('ledger');
    setTargetProtocol(protocol);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = {
    ES: { citizen: "CIUDADANO", auditor: "AUDITOR", ethos: "ETHOS", loading: "SINCRONIZANDO..." },
    EN: { citizen: "CITIZEN", auditor: "AUDITOR", ethos: "ETHOS", loading: "SYNCING..." }
  }[lang];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 pb-64 ${isDark ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
      <Header 
        lang={lang} setLang={setLang}
        theme={theme} setTheme={setTheme}
        accessibilityMode={accessibilityMode}
        setAccessibilityMode={setAccessibilityMode}
        data={filteredData}
      />
      
      <main className="flex-grow px-4 md:px-12 pt-24 md:pt-28 max-w-[1600px] mx-auto w-full overflow-x-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6">
          <IntegrityMonitor lang={lang} data={filteredData} loading={loading} theme={theme} colorBlindMode={accessibilityMode !== 'none'} />
          
          <div className={`flex w-full md:w-auto p-1 rounded-full border transition-all duration-500 ${isDark ? 'bg-zinc-900/50 border-white/5 shadow-inner' : 'bg-white border-black/5 shadow-sm'}`}>
            <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar touch-pan-x">
              {[
                { id: 'citizen', label: t.citizen },
                { id: 'auditor', label: t.auditor },
                { id: 'system', label: t.ethos }
              ].map((btn) => (
                <button 
                  key={btn.id}
                  onClick={() => setView(btn.id as ViewMode)} 
                  className={`flex-1 md:flex-none px-6 md:px-10 py-3 text-[9px] md:text-[10px] font-black tracking-widest rounded-full transition-all duration-300 whitespace-nowrap ${
                    view === btn.id 
                      ? (isDark ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]' : 'bg-blue-600/10 text-blue-600 border border-blue-500/20 shadow-sm') 
                      : (isDark ? 'text-zinc-500 hover:text-zinc-300 border border-transparent' : 'text-zinc-400 hover:text-zinc-900 border border-transparent')
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && !filteredData ? (
          <div className="h-[50vh] flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <span className="text-[10px] font-black tracking-[0.5em] opacity-30">{t.loading}</span>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {view === 'citizen' && (
              <CitizenView 
                lang={lang} data={filteredData} 
                selectedDept={selectedDept} setSelectedDept={setSelectedDept}
                theme={theme} colorBlindMode={accessibilityMode !== 'none'} 
              />
            )}
            {view === 'auditor' && (
              <AuditorView 
                lang={lang} data={filteredData} 
                theme={theme} colorBlindMode={accessibilityMode !== 'none'}
                activeTab={auditorSubTab}
                setActiveTab={setAuditorSubTab}
                preselectedProtocol={targetProtocol}
              />
            )}
            {view === 'system' && (
              <SystemView 
                lang={lang} theme={theme} colorBlindMode={accessibilityMode !== 'none'} 
                data={filteredData}
              />
            )}
          </div>
        )}
      </main>

      <Timeline 
        value={timeCursor} onChange={setTimeCursor} 
        history={data?.history || []} 
        theme={theme} lang={lang}
        candidates={data?.candidates || []}
        protocols={data?.latestProtocols || []}
        onAlertClick={handleAlertJump}
      />
    </div>
  );
};

export default App;
