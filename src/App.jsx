import React from 'react';
import { Activity, ShieldAlert, Zap, Globe, Cpu } from 'lucide-react';
import Gauge from './components/Gauge';
import VaultCard from './components/VaultCard';
import FactoryScan from './components/FactoryScan';
import { useVaults } from './hooks/useVaults';

function App() {
  const { vaults, globalHealth, loading, triggerCrash } = useVaults();

  return (
    <div className="min-h-screen p-4 md:p-8 relative selection:bg-neon-green selection:text-black">
      {/* CRT Scanline Effect Overlay */}
      <div className="crt-overlay" />
      
      {/* HEADER SECTION */}
      <header className="flex justify-between items-start mb-10 border-b border-neon-green/30 pb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-sm border-2 border-neon-green flex items-center justify-center cursor-pointer hover:bg-neon-green hover:text-black transition-all duration-300"
            onClick={triggerCrash} // Vibe feature: Click logo to simulate stress
          >
            <span className="font-black text-2xl">C</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-neon-green italic">
              Concrete Health Radar
            </h1>
            <div className="flex gap-4 mt-1">
              <p className="text-[10px] opacity-70 text-neon-green flex items-center gap-1">
                <Cpu size={10} /> CORE_ENGINE: V1.0.4
              </p>
              <p className="text-[10px] opacity-70 text-neon-green flex items-center gap-1">
                <Globe size={10} /> NODE: MODULAR_MAINNET
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block text-right">
          <div className="text-[10px] text-radar-blue font-bold tracking-widest">ENCRYPTED CONNECTION</div>
          <div className="text-[9px] opacity-50 text-white">EST. LATENCY: 14MS</div>
        </div>
      </header>

      {/* MAIN DASHBOARD GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
        
        {/* LEFT COLUMN: LIVE VAULT FEED */}
        <section className="lg:col-span-3 glass-panel p-4 flex flex-col h-[60vh] lg:h-[70vh]">
          <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-bold flex items-center gap-2 text-neon-green">
              <Activity size={14} /> ACTIVE VAULTS
            </h3>
            <span className="text-[10px] bg-neon-green/10 px-2 py-0.5 rounded text-neon-green">
              {vaults.length} LIVE
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 w-full bg-white/5 animate-pulse rounded-sm" />
                ))}
                <p className="text-[10px] text-center opacity-40 uppercase tracking-tighter">Initializing Neural Link...</p>
              </div>
            ) : (
              vaults.map((vault, i) => (
                <VaultCard 
                  key={i} 
                  name={vault.name} 
                  health={vault.health} 
                  assets={vault.assets} 
                />
              ))
            )}
          </div>
        </section>

        {/* CENTER COLUMN: THE MAIN RADAR */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center py-6 min-h-[400px]">
          <div className="relative w-full flex justify-center">
            {/* Background Decorative Rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-[120%] aspect-square border border-neon-green rounded-full animate-[ping_10s_linear_infinite]" />
              <div className="w-[100%] aspect-square border border-radar-blue rounded-full animate-[ping_15s_linear_infinite]" />
            </div>
            
            <Gauge value={globalHealth} label="SYSTEM STRESS INDEX" />
          </div>
        </section>

        {/* RIGHT COLUMN: SYSTEM METRICS & ALERTS */}
        <section className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-4">
            <h3 className="text-xs font-bold opacity-50 mb-4 text-neon-green tracking-widest">GLOBAL STATS</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-1">
                <span className="text-[10px] opacity-60 uppercase">Total Liquidity</span> 
                <span className="text-white font-bold">$1.24B</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-1">
                <span className="text-[10px] opacity-60 uppercase">Network Load</span> 
                <span className="text-neon-green font-mono">42%</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-1">
                <span className="text-[10px] opacity-60 uppercase">Safety Buffer</span> 
                <span className="text-radar-blue font-mono">18.4%</span>
              </div>
            </div>
          </div>
          
          {/* DYNAMIC ALERT BOX */}
          <div className={`p-4 rounded-sm border transition-all duration-500 ${
            globalHealth < 60 
              ? 'bg-warning-red/10 border-warning-red animate-pulse' 
              : 'bg-neon-green/5 border-neon-green/20'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-black ${
              globalHealth < 60 ? 'text-warning-red' : 'text-neon-green'
            }`}>
              <ShieldAlert size={16} /> 
              {globalHealth < 60 ? 'CRITICAL ALERT' : 'SYSTEM NOMINAL'}
            </div>
            <p className="text-[10px] mt-2 leading-relaxed opacity-80 italic">
              {globalHealth < 60 
                ? 'Warning: Aggregate health factor below safety threshold. Liquidation monitoring engaged.' 
                : 'All modular vaults operating within safe debt parameters. No action required.'}
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER: TERMINAL FEED */}
      <FactoryScan vaultCount={vaults.length} />
    </div>
  );
}

export default App;
