import React from 'react';
import { Activity, ShieldAlert, Globe, Cpu } from 'lucide-react';
import Gauge from './components/Gauge';
import VaultCard from './components/VaultCard';
// FIXED: Changed to lowercase to match your file and fix the build error
import FactoryScan from './components/FactoryScan'; 
import { useVaults } from './hooks/useVaults';

function App() {
  const { vaults, globalHealth, loading } = useVaults();

  // FIXED: Alert logic - only red if health is between 1 and 60. 
  // If it's 0 (loading), it stays green/neutral.
  const isCritical = globalHealth > 0 && globalHealth < 60;

  return (
    <div className="min-h-screen p-4 md:p-8 relative selection:bg-neon-green selection:text-black">
      <div className="crt-overlay" />
      
      <header className="flex justify-between items-start mb-10 border-b border-neon-green/30 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm border-2 border-neon-green flex items-center justify-center">
            <span className="font-black text-2xl text-neon-green">C</span>
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
                <Globe size={10} /> NODE: ETH_MAINNET
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
        <section className="lg:col-span-3 glass-panel p-4 flex flex-col h-[60vh] lg:h-[70vh]">
          <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-bold flex items-center gap-2 text-neon-green">
              <Activity size={14} /> ACTIVE VAULTS
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
            {loading ? (
              <div className="animate-pulse text-[10px] text-neon-green opacity-40 uppercase">Syncing Chain Data...</div>
            ) : (
              vaults.map((vault, i) => (
                <VaultCard key={i} name={vault.name} health={vault.health} assets={vault.assets} />
              ))
            )}
          </div>
        </section>

        <section className="lg:col-span-6 flex flex-col items-center justify-center py-6 min-h-[400px]">
          <Gauge value={globalHealth} label="SYSTEM STRESS INDEX" />
        </section>

        <section className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-4">
            <h3 className="text-xs font-bold opacity-50 mb-4 text-neon-green tracking-widest">GLOBAL STATS</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-1 text-[10px]">
                <span className="opacity-60 uppercase">ACTIVE VAULTS</span> 
                <span className="text-white font-bold">{vaults.length}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-1 text-[10px]">
                <span className="opacity-60 uppercase">STATUS</span> 
                <span className={isCritical ? 'text-warning-red font-bold' : 'text-neon-green font-bold'}>
                  {isCritical ? 'STRESSED' : 'NOMINAL'}
                </span>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-sm border transition-all duration-500 ${
            isCritical ? 'bg-warning-red/10 border-warning-red animate-pulse' : 'bg-neon-green/5 border-neon-green/20'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-black ${
              isCritical ? 'text-warning-red' : 'text-neon-green'
            }`}>
              <ShieldAlert size={16} /> 
              {isCritical ? 'CRITICAL ALERT' : 'SYSTEM NOMINAL'}
            </div>
            <p className="text-[10px] mt-2 leading-relaxed opacity-80 italic text-white">
              {isCritical 
                ? 'Warning: Aggregate health factor below safety threshold.' 
                : 'All modular vaults operating within safe debt parameters.'}
            </p>
          </div>
        </section>
      </main>

      <FactoryScan vaultCount={vaults.length} />
    </div>
  );
}

export default App;
