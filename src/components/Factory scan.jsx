import React, { useState, useEffect } from 'react';

const FactoryScan = ({ vaultCount = 0 }) => {
  const [currentLog, setCurrentLog] = useState("INITIALIZING SCANNER...");

  useEffect(() => {
    const logs = [
      "CONNECTING TO CONCRETE FACTORY...",
      `DETECTED ${vaultCount} ACTIVE VAULTS`,
      "SCANNING DEBT LAYERS...",
      "HEALTH METRICS: SYNCED",
      "MONITORING LIQUIDITY EVENTS...",
      "SYSTEM STATUS: NOMINAL"
    ];

    let i = 0;
    const interval = setInterval(() => {
      setCurrentLog(logs[i]);
      i = (i + 1) % logs.length;
    }, 3500); // Changes message every 3.5 seconds

    return () => clearInterval(interval);
  }, [vaultCount]);

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-neon-green/20 p-2 z-50">
      <div className="flex items-center gap-4 px-4 font-mono text-[9px] uppercase tracking-widest text-neon-green">
        <span className="flex h-2 w-2 rounded-full bg-neon-green animate-ping"></span>
        <span className="opacity-50">LIVE_FEED:</span>
        <span className="font-bold">{currentLog}</span>
        
        {/* Hidden on mobile to keep it clean */}
        <div className="ml-auto hidden md:flex gap-6 opacity-40">
          <span>LATENCY: 18ms</span>
          <span>MEM: 124MB</span>
          <span>S: 0.23.1</span>
        </div>
      </div>
    </footer>
  );
};

export default FactoryScan;
