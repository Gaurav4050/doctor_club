'use client';

export default function ClubEmblem({ size = 120, className = "" }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-xl select-none"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B2545" />
            <stop offset="50%" stopColor="#081B38" />
            <stop offset="100%" stopColor="#030C19" />
          </linearGradient>

          <linearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <path
            id="textPathTop"
            d="M 28 100 A 72 72 0 0 1 172 100"
            fill="none"
          />
          <path
            id="textPathBottom"
            d="M 172 100 A 72 72 0 0 1 28 100"
            fill="none"
          />
        </defs>

        {/* Outer Gold Ring with Sawtooth / Star accent glow */}
        <circle cx="100" cy="100" r="96" fill="url(#blueGradient)" stroke="url(#goldGradient)" strokeWidth="4.5" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Circular text banner background */}
        <circle cx="100" cy="100" r="83" fill="#06162D" stroke="url(#goldGradient)" strokeWidth="1" />

        {/* Text Along Path: Top "ALL INDIA" */}
        <text fill="url(#goldGradient)" fontSize="13.5" fontWeight="900" letterSpacing="3.5" textAnchor="middle">
          <textPath href="#textPathTop" startOffset="50%">
            ALL INDIA
          </textPath>
        </text>

        {/* Text Along Path: Bottom "DOCTORS CLUB" */}
        <text fill="url(#goldGradient)" fontSize="13.5" fontWeight="900" letterSpacing="3" textAnchor="middle">
          <textPath href="#textPathBottom" startOffset="50%">
            DOCTORS CLUB
          </textPath>
        </text>

        {/* Middle Core Circle */}
        <circle cx="100" cy="100" r="58" fill="url(#innerGlow)" stroke="url(#goldGradient)" strokeWidth="2.5" />

        {/* Caduceus Wings & Rod */}
        <g transform="translate(100, 72) scale(0.72)">
          {/* Staff Rod */}
          <path d="M 0 -22 L 0 54" stroke="url(#goldGradient)" strokeWidth="4" strokeLinecap="round" />
          {/* Top Sphere of Rod */}
          <circle cx="0" cy="-24" r="5" fill="url(#goldGradient)" />

          {/* Wings */}
          <path
            d="M 0 -18 C -18 -32 -38 -20 -44 -6 C -40 2 -24 -2 0 -10 C 24 -2 40 2 44 -6 C 38 -20 18 -32 0 -18 Z"
            fill="url(#goldGradient)"
            opacity="0.9"
          />
          <path
            d="M 0 -14 C -14 -24 -28 -14 -32 -4 C -28 2 -16 -1 0 -7 C 16 -1 28 2 32 -4 C 28 -14 14 -24 0 -14 Z"
            fill="#FFF"
            opacity="0.6"
          />

          {/* Snakes intertwining */}
          <path
            d="M -16 20 C -22 10 -4 4 0 -2 C 4 4 22 10 16 20 C 10 30 -6 32 0 42"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 16 20 C 22 10 4 4 0 -2 C -4 4 -22 10 -16 20 C -10 30 6 32 0 42"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Doctor Silhouettes: 3 Doctors (Center Male, Left & Right Doctors) */}
        <g transform="translate(100, 114) scale(0.68)">
          {/* Left Doctor */}
          <circle cx="-32" cy="-22" r="9" fill="#E2E8F0" opacity="0.85" />
          <path d="M -46 8 C -46 -10 -18 -10 -18 8 Z" fill="#E2E8F0" opacity="0.85" />

          {/* Right Doctor */}
          <circle cx="32" cy="-22" r="9" fill="#E2E8F0" opacity="0.85" />
          <path d="M 18 8 C 18 -10 46 -10 46 8 Z" fill="#E2E8F0" opacity="0.85" />

          {/* Center Main Doctor (Prominent) */}
          <circle cx="0" cy="-26" r="11" fill="#FFFFFF" />
          <path d="M -22 12 C -22 -12 22 -12 22 12 Z" fill="#FFFFFF" />
          {/* Stethoscope around neck */}
          <path
            d="M -7 -6 C -7 4 -3 10 0 10 C 3 10 7 4 7 -6"
            fill="none"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="0" cy="11" r="2.5" fill="#0284C7" />
        </g>

        {/* Small Medical Cross at bottom */}
        <g transform="translate(100, 138) scale(0.7)">
          <circle cx="0" cy="0" r="10" fill="url(#goldGradient)" />
          <rect x="-2" y="-6" width="4" height="12" fill="#081B38" rx="1" />
          <rect x="-6" y="-2" width="12" height="4" fill="#081B38" rx="1" />
        </g>
      </svg>
    </div>
  );
}
