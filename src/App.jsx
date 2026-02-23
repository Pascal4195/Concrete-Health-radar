import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import Gauge from './components/Gauge';
import VaultCard from './components/VaultCard';
import { useVaults } from './hooks/useVaults';

function App() {
  const { vaults, globalHealth, loading, error } = useVaults();

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="crt-overlay" />
      
      <header className="flex justify-between items-center mb-10 border-b border-neon-green/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-neon-green flex items-center justify-center animate-pulse">
            <span className="font-bold text-xl text-neon-green">C</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase text-neon-green">Concrete Health Radar</h1>
            <p className="text-[10px] opacity-70 text-neon-green">SYSTEM-WIDE STRESS MONITOR // V1.0.4</p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: DYNAMIC VAULT LIST */}
        <section className="lg:col-span-3 glass-panel p-4 space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2 text-neon-green">
            <Activity size={14} /> ACTIVE VAULTS
          </h3>
          
          {loading ? (
            <div className="animate-pulse text-[10px] text-neon-green opacity-50">INITIALIZING SCANNER...</div>
          ) : (
            vaults.map((vault, i) => (
              <VaultCard key={i} name={vault.name} health={vault.health} assets={vault.assets} />
            ))
          )}
        </section>

        {/* CENTER: THE GAUGE */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center py-10">
          <Gauge value={globalHealth} />
        </section>

        {/* RIGHT: GLOBAL STATS */}
        <section className="lg:col-span-3 glass-panel p-4 space-y-6">
          <div>
            <h3 className="text-xs font-bold opacity-50 mb-2 text-neon-green">GLOBAL METRICS</h3>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[10px]">TOTAL VAULTS:</span> 
                <span className="text-white">{vaults.length}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[10px]">SYSTEM STATUS:</span> 
                <span className={globalHealth > 50 ? 'text-neon-green' : 'text-warning-red'}>
                  {globalHealth > 50 ? 'NOMINAL' : 'STRESSED'}
                </span>
              </div>
            </div>
          </div>
          
          {globalHealth < 60 && (
            <div className="p-3 bg-warning-red/10 border border-warning-red/30 rounded animate-pulse">
              <div className="flex items-center gap-2 text-warning-red text-xs font-bold">
                <ShieldAlert size={16} /> ALERT
              </div>
              <p className="text-[10px] mt-1 text-warning-red/80">SYSTEM-WIDE COLLATERAL REBALANCING SUGGESTED</p>
            </div>
          )}
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-black border-t border-neon-green/30 p-2 overflow-hidden">
        <div className="whitespace-nowrap flex gap-10 animate-[scanline_20s_linear_infinite] text-[10px] text-neon-green opacity-80 uppercase">
          <span>*** Scanning Factory: {vaults.length} Vaults Found ***</span>
          <span>Security Protocol: Concrete.xyz Liquidity Engine ***</span>
          <span>Status: Monitoring Modular Debt Layers ***</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
