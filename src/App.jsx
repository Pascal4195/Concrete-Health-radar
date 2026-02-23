import React from 'react';
import { Activity, ShieldAlert, Zap } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="crt-overlay" />
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 border-b border-neon-green/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-neon-green flex items-center justify-center animate-pulse">
            <span className="font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase">Concrete Health Radar</h1>
            <p className="text-[10px] opacity-70">SYSTEM-WIDE STRESS MONITOR // V1.0.4</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs">NETWORK: MODULAR_MAINNET</p>
          <p className="text-xs text-radar-blue">STATUS: SYNCED</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: VAULT LIST (Placeholder) */}
        <section className="lg:col-span-3 glass-panel p-4 space-y-4">
          <h3 className="text-xs font-bold border-b border-white/10 pb-2 flex items-center gap-2">
            <Activity size={14} /> ACTIVE VAULTS
          </h3>
          <div className="animate-pulse text-[10px] opacity-50">INITIALIZING SCANNER...</div>
        </section>

        {/* CENTER: THE GAUGE (Placeholder) */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center py-10">
          <div className="w-full max-w-md aspect-square rounded-full border border-dashed border-neon-green/20 flex items-center justify-center relative">
             <div className="text-center">
                <span className="text-6xl font-black italic">78.5%</span>
                <p className="text-sm tracking-[0.2em] mt-2">GLOBAL HEALTH</p>
             </div>
             {/* We will build the SVG Gauge here next */}
          </div>
        </section>

        {/* RIGHT: STATS */}
        <section className="lg:col-span-3 glass-panel p-4 space-y-6">
          <div>
            <h3 className="text-xs font-bold opacity-50 mb-2">GLOBAL METRICS</h3>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-[10px]">TOTAL DEBT:</span> <span className="text-white">$1.2B</span></div>
              <div className="flex justify-between"><span className="text-[10px]">COLLATERAL:</span> <span className="text-white">$1.5B</span></div>
            </div>
          </div>
          <div className="p-3 bg-warning-red/10 border border-warning-red/30 rounded">
            <div className="flex items-center gap-2 text-warning-red text-xs font-bold">
              <ShieldAlert size={16} /> ALERT
            </div>
            <p className="text-[10px] mt-1 text-warning-red/80">VAULT #012 BELOW THRESHOLD</p>
          </div>
        </section>
      </main>

      {/* FOOTER SCANNER */}
      <footer className="fixed bottom-0 left-0 w-full bg-black border-t border-neon-green/30 p-2 overflow-hidden">
        <div className="whitespace-nowrap flex gap-10 animate-[scanline_20s_linear_infinite] text-[10px] opacity-80">
          <span>*** ATTENTION: MONITORING ALL CONCRETE VAULTS ***</span>
          <span>FACTORY DETECTED: AUTO-QUERYING NEW DEPLOYMENTS...</span>
          <span>LATENCY: 12ms</span>
          <span>HEALTH FACTOR NOMINAL</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
