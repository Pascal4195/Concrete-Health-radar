import React from 'react';

const Gauge = ({ value = 78.5, label = "GLOBAL HEALTH" }) => {
  // SVG Math: A semi-circle with radius 40
  const radius = 40;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[300px]">
      <svg viewBox="0 0 100 60" className="w-full h-auto rotate-0">
        {/* Background Track */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Progress Gradient Track */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3131" /> {/* Critical */}
            <stop offset="50%" stopColor="#FBFF00" /> {/* Warning */}
            <stop offset="100%" stopColor="#39FF14" /> {/* Chill */}
          </linearGradient>
        </defs>
      </svg>

      {/* Center Text Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
        <div className="text-5xl font-black italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {value}%
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase opacity-60 mt-2">
          {label}
        </div>
      </div>

      {/* Needle or Marker (Optional Vibe) */}
      <div className="flex justify-between w-full mt-2 px-4 text-[10px] font-bold">
        <span className="text-warning-red">CRITICAL</span>
        <span className="text-neon-green">CHILL</span>
      </div>
    </div>
  );
};

export default Gauge;
