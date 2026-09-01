import React from 'react';

interface FacilityLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  textClassName?: string;
  variant?: 'full' | 'icon' | 'badge';
}

export const FacilityLogo: React.FC<FacilityLogoProps> = ({
  className = '',
  size = 48,
  showText = false,
  textColor = 'text-[#1E293B]',
  textClassName = '',
  variant = 'badge',
}) => {
  const numericSize = typeof size === 'number' ? size : parseInt(size as string, 10) || 48;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Vector Logo */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center"
        style={{ width: numericSize, height: numericSize }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <linearGradient id="nightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            <clipPath id="circleClip">
              <circle cx="100" cy="100" r="92" />
            </clipPath>
          </defs>

          {/* Outer Border Glow Ring */}
          <circle
            cx="100"
            cy="100"
            r="96"
            stroke="url(#borderGrad)"
            strokeWidth="5"
            fill="#0F172A"
          />

          <g clipPath="url(#circleClip)">
            {/* Background Split - Top Left Day Sky */}
            <path d="M 0 0 L 200 0 L 200 70 L 0 160 Z" fill="url(#skyGrad)" />
            
            {/* Background Split - Bottom Right Dark Night */}
            <path d="M 0 160 L 200 70 L 200 200 L 0 200 Z" fill="url(#nightGrad)" />

            {/* Diagonal Cyan Accent Slash */}
            <path
              d="M -10 168 L 210 78 L 210 68 L -10 158 Z"
              fill="#0284C7"
              opacity="0.9"
            />
            <path
              d="M -10 164 L 210 74 L 210 70 L -10 160 Z"
              fill="#FFFFFF"
              opacity="0.8"
            />

            {/* Skyscrapers & Skyline Vector Art */}
            {/* Left buildings */}
            <rect x="24" y="80" width="14" height="60" fill="#FFFFFF" opacity="0.9" rx="1" />
            <rect x="42" y="65" width="16" height="75" fill="#FFFFFF" opacity="0.95" rx="1" />
            <rect x="62" y="75" width="14" height="65" fill="#FFFFFF" opacity="0.9" rx="1" />
            <rect x="80" y="45" width="22" height="95" fill="#FFFFFF" opacity="0.98" rx="1" />
            
            {/* Right buildings */}
            <rect x="106" y="55" width="18" height="85" fill="#FFFFFF" opacity="0.95" rx="1" />
            <rect x="128" y="68" width="18" height="72" fill="#FFFFFF" opacity="0.9" rx="1" />
            <rect x="150" y="85" width="15" height="55" fill="#FFFFFF" opacity="0.85" rx="1" />
            <rect x="168" y="98" width="12" height="42" fill="#FFFFFF" opacity="0.8" rx="1" />

            {/* Building Windows (Geometric Grid dots) */}
            <g fill="#0F172A" opacity="0.75">
              <circle cx="86" cy="55" r="1.5" /><circle cx="92" cy="55" r="1.5" />
              <circle cx="86" cy="63" r="1.5" /><circle cx="92" cy="63" r="1.5" />
              <circle cx="86" cy="71" r="1.5" /><circle cx="92" cy="71" r="1.5" />
              <circle cx="86" cy="79" r="1.5" /><circle cx="92" cy="79" r="1.5" />
              <circle cx="86" cy="87" r="1.5" /><circle cx="92" cy="87" r="1.5" />
              <circle cx="112" cy="65" r="1.5" /><circle cx="118" cy="65" r="1.5" />
              <circle cx="112" cy="73" r="1.5" /><circle cx="118" cy="73" r="1.5" />
              <circle cx="112" cy="81" r="1.5" /><circle cx="118" cy="81" r="1.5" />
              <circle cx="134" cy="76" r="1.5" /><circle cx="140" cy="76" r="1.5" />
              <circle cx="134" cy="84" r="1.5" /><circle cx="140" cy="84" r="1.5" />
            </g>

            {/* Industrial Pipes and Hydraulic Valves on top */}
            <path
              d="M 38 75 L 38 40 L 72 40 L 72 25 L 90 25"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.95"
            />
            {/* Top valve left */}
            <circle cx="78" cy="25" r="5" fill="#FFFFFF" />
            <path d="M 78 17 L 78 33" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 72 17 L 84 17" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Pipe network right */}
            <path
              d="M 115 48 L 138 48 L 138 60 L 165 60 L 165 85"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.95"
            />
            {/* Top valve right */}
            <circle cx="128" cy="48" r="5" fill="#FFFFFF" />
            <path d="M 128 40 L 128 56" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 122 40 L 134 40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Dark curved bottom banner backing */}
            <path
              d="M 10 130 C 50 120 150 120 190 130 L 190 200 L 10 200 Z"
              fill="#0F172A"
              opacity="0.95"
            />

            {/* "Facility Bombas" Typography within the emblem */}
            <text
              x="100"
              y="144"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="18"
              letterSpacing="0.3"
            >
              Facility Bombas
            </text>

            {/* White Swimming Pool Water Pump Graphic at Bottom */}
            <g transform="translate(68, 154) scale(0.68)" fill="#FFFFFF">
              {/* Pump electric motor body */}
              <rect x="6" y="10" width="38" height="22" rx="3" fill="#FFFFFF" />
              {/* Motor fins */}
              <line x1="14" y1="10" x2="14" y2="32" stroke="#141726" strokeWidth="2" />
              <line x1="22" y1="10" x2="22" y2="32" stroke="#141726" strokeWidth="2" />
              <line x1="30" y1="10" x2="30" y2="32" stroke="#141726" strokeWidth="2" />
              <line x1="38" y1="10" x2="38" y2="32" stroke="#141726" strokeWidth="2" />
              {/* Motor mount bracket */}
              <rect x="14" y="32" width="22" height="6" rx="1" fill="#FFFFFF" />
              {/* Pre-filter basket / pump volute housing */}
              <path
                d="M 44 8 C 44 8 50 4 60 4 C 70 4 76 8 76 8 L 76 34 C 76 37 72 40 60 40 C 48 40 44 37 44 34 Z"
                fill="#FFFFFF"
              />
              {/* Top suction/discharge port pipe */}
              <rect x="56" y="-2" width="8" height="7" fill="#FFFFFF" />
              <rect x="53" y="-5" width="14" height="4" rx="1" fill="#FFFFFF" />
              {/* Front suction pipe connection */}
              <path
                d="M 76 22 L 88 22 L 88 38 L 82 38 L 82 28 L 76 28 Z"
                fill="#FFFFFF"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Optional Side Label Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-lg leading-tight ${textColor} ${textClassName}`}>
              Facility Bombas
            </span>
            <span className="bg-sky-50 text-[#0284C7] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider border border-sky-200">
              Admin
            </span>
          </div>
          <span className="text-xs text-[#64748B] font-medium tracking-wide">
            Controle de Metas
          </span>
        </div>
      )}
    </div>
  );
};
