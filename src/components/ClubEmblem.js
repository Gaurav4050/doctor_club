'use client';

import { useId } from 'react';

export default function ClubEmblem({ size = 120, className = "" }) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, '');

  const goldGradId = `gold_grad_${id}`;
  const blueGradId = `blue_grad_${id}`;
  const topPathId = `top_path_${id}`;
  const bottomPathId = `bottom_path_${id}`;

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="w-full h-full select-none"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.25))' }}
      >
        <defs>
          <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id={blueGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B2545" />
            <stop offset="50%" stopColor="#081C38" />
            <stop offset="100%" stopColor="#051020" />
          </linearGradient>

          {/* Top text arch path */}
          <path
            id={topPathId}
            d="M 30,100 A 70,70 0 0,1 170,100"
            fill="none"
          />

          {/* Bottom text arch path */}
          <path
            id={bottomPathId}
            d="M 170,100 A 70,70 0 0,1 30,100"
            fill="none"
          />
        </defs>

        {/* Outer Golden Laurels / Dots Ring */}
        <circle cx="100" cy="100" r="97" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Outer Royal Navy Blue Band */}
        <circle cx="100" cy="100" r="88" fill={`url(#${blueGradId})`} stroke="#F59E0B" strokeWidth="3" />

        {/* Inner Circle Border */}
        <circle cx="100" cy="100" r="58" fill="#F8FAFC" stroke="#F59E0B" strokeWidth="3.5" />

        {/* Circular Text: "ALL INDIA" (Top) */}
        <text
          fill="#FDE68A"
          stroke="#92400E"
          strokeWidth="0.5"
          fontSize="14"
          fontWeight="900"
          letterSpacing="4"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          <textPath href={`#${topPathId}`} startOffset="50%">
            ALL INDIA
          </textPath>
        </text>

        {/* Circular Text: "DOCTORS CLUB" (Bottom) */}
        <text
          fill="#FDE68A"
          stroke="#92400E"
          strokeWidth="0.5"
          fontSize="13"
          fontWeight="900"
          letterSpacing="3"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          <textPath href={`#${bottomPathId}`} startOffset="50%">
            DOCTORS CLUB
          </textPath>
        </text>

        {/* Inner White Field Elements */}
        {/* Caduceus Wings & Rod at Top of Inner Circle */}
        <g transform="translate(100, 64) scale(0.68)">
          {/* Rod */}
          <path d="M 0 -18 L 0 38" stroke="#081B38" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="0" cy="-20" r="4.5" fill="#D97706" stroke="#081B38" strokeWidth="1" />

          {/* Wings */}
          <path
            d="M 0 -14 C -16 -28 -34 -18 -40 -6 C -34 0 -20 -4 0 -10 C 20 -4 34 0 40 -6 C 34 -18 16 -28 0 -14 Z"
            fill="#081B38"
          />
          <path
            d="M 0 -11 C -12 -20 -24 -12 -28 -4 C -24 0 -14 -3 0 -8 C 14 -3 24 0 28 -4 C 24 -12 12 -20 0 -11 Z"
            fill="#F59E0B"
          />

          {/* Entwined Serpents */}
          <path
            d="M -12 12 C -18 4 -4 0 0 -5 C 4 0 18 4 12 12 C 6 20 -6 22 0 30"
            fill="none"
            stroke="#081B38"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 12 12 C 18 4 4 0 0 -5 C -4 0 -18 4 -12 12 C -6 20 6 22 0 30"
            fill="none"
            stroke="#081B38"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* 3 Doctors Silhouette in Dark Navy (#081B38) */}
        <g transform="translate(100, 102) scale(0.72)">
          {/* Left Doctor */}
          <circle cx="-28" cy="-18" r="7.5" fill="#081B38" />
          <path d="M -40 8 C -40 -6 -16 -6 -16 8 Z" fill="#081B38" />
          {/* Left Doctor White Shirt / Tie */}
          <polygon points="-28,-5 -25,2 -28,8 -31,2" fill="#F8FAFC" />

          {/* Right Doctor (Female doctor silhouette) */}
          <circle cx="28" cy="-18" r="7.5" fill="#081B38" />
          <path d="M 16 8 C 16 -6 40 -6 40 8 Z" fill="#081B38" />
          {/* Right Doctor Hair/Collar */}
          <polygon points="28,-5 31,2 28,8 25,2" fill="#F8FAFC" />

          {/* Center Main Doctor (Front, larger) */}
          <circle cx="0" cy="-22" r="9.5" fill="#081B38" />
          <path d="M -20 12 C -20 -8 20 -8 20 12 Z" fill="#081B38" />
          {/* Center Doctor White Shirt & Stethoscope */}
          <polygon points="0,-7 4,3 0,10 -4,3" fill="#F8FAFC" />
          <path
            d="M -7 -4 C -7 5 -3 10 0 10 C 3 10 7 5 7 -4"
            fill="none"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Medical Cross Badge at Bottom Center of Inner Field */}
        <g transform="translate(100, 126)">
          <circle cx="0" cy="0" r="10.5" fill="#0B2545" stroke="#F59E0B" strokeWidth="1.5" />
          {/* White Cross */}
          <rect x="-2" y="-6" width="4" height="12" fill="#FFFFFF" rx="0.8" />
          <rect x="-6" y="-2" width="12" height="4" fill="#FFFFFF" rx="0.8" />
        </g>
      </svg>
    </div>
  );
}
