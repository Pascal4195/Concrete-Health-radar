import React from 'react';
import { Zap } from 'lucide-react';

const VaultCard = ({ name, health, assets }) => {
  const isCritical = health < 50;

  return (
    <div className="group border-b border-white/5 py-3 hover:bg-neon-green/5 transition-colors cursor-pointer px-2">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h4 className="text-[11px] font-bold text-white group-hover:text-neon-green">{name}</h4>
          <p className="text-[9px] opacity-50 uppercase">TVL: {assets}</p>
        </div>
        <div className={`text-[10px] font-mono ${isCritical ? 'text-warning-red animate-pulse' : 'text-neon-green'}`}>
          {health}% {isCritical && '!!'}
        </div>
      </div>
      
      {/* Mini Health Bar */}
      <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${isCritical ? 'bg-warning-red' : 'bg-neon-green'}`}
          style={{ width: `${health}%` }}
        />
      </div>
    </div>
  );
};

export default VaultCard;
