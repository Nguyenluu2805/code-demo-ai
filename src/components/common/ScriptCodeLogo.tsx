import React from 'react';

interface ScriptCodeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const ScriptCodeLogo: React.FC<ScriptCodeLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { icon: 'w-9 h-9', text: 'text-[15px] sm:text-base', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', badge: 'text-xs px-2.5 py-0.5' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon with Cyber Glow */}
      <div className={`relative ${currentSize.icon} flex-shrink-0 group`}>
        {/* Outer Glow Ring */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-tilt" />
        
        {/* Core Icon Container */}
        <div className="relative w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center border border-indigo-500/30 overflow-hidden shadow-2xl">
          {/* Futuristic Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:6px_6px] opacity-20" />

          {/* SVG Brand Mark */}
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5/6 h-5/6 drop-shadow-[0_2px_8px_rgba(99,102,241,0.6)]"
          >
            {/* Left Bracket < */}
            <path
              d="M12 11L6 18L12 25"
              stroke="url(#sc-grad-left)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right Bracket > */}
            <path
              d="M24 11L30 18L24 25"
              stroke="url(#sc-grad-right)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Studio Center Wave / Slash Play Bar */}
            <path
              d="M20 9L15 27"
              stroke="url(#sc-grad-center)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            {/* Play/Record Indicator Pulse Dot */}
            <circle cx="18" cy="18" r="2.2" fill="#06b6d4" className="animate-pulse" />

            {/* Gradients */}
            <defs>
              <linearGradient id="sc-grad-left" x1="6" y1="11" x2="12" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="sc-grad-right" x1="24" y1="11" x2="30" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="sc-grad-center" x1="20" y1="9" x2="15" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold ${currentSize.text} tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400`}>
              ScriptCode
            </span>
            <span className={`font-bold ${currentSize.badge} bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.15)] flex items-center gap-1`}>
              <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
              STUDIO
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-zinc-400 font-normal hidden sm:block">
            Next-Gen AI Code Video & Presentation Platform
          </p>
        </div>
      )}
    </div>
  );
};
