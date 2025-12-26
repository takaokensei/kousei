import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

export const KouseiLogo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Definições de Gradientes Tokyo Night */}
            <defs>
                <linearGradient id="glassBase" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#24283b" />
                    <stop offset="100%" stopColor="#1a1b26" />
                </linearGradient>

                <linearGradient id="accentGlow" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7aa2f7" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#bb9af7" stopOpacity="0.6" />
                </linearGradient>

                <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                </filter>
            </defs>

            {/* 1. O Squircle (Container Base) */}
            <path
                d="M 60,5 
           C 25,5 5,25 5,60 
           C 5,95 25,115 60,115 
           C 95,115 115,95 115,60 
           C 115,25 95,5 60,5 Z"
                fill="url(#glassBase)"
                stroke="rgba(122, 162, 247, 0.3)"
                strokeWidth="2"
            />

            {/* 2. Camadas de Estrutura (Representando 'Kousei' / Composição) */}
            {/* Camada Inferior (Base) */}
            <rect
                x="35" y="65" width="50" height="25" rx="4"
                fill="#414868" fillOpacity="0.8"
                transform="skewY(-10)"
            />

            {/* Camada Média (Lógica) */}
            <rect
                x="35" y="50" width="50" height="25" rx="4"
                fill="#565f89" fillOpacity="0.9"
                transform="skewY(-10)"
            />

            {/* Camada Superior (Acento - O PDF/Latex Final) */}
            <rect
                x="35" y="35" width="50" height="25" rx="4"
                fill="url(#accentGlow)"
                stroke="#c0caf5" strokeWidth="1"
                transform="skewY(-10)"
            />

            {/* Brilho Sutil no Topo */}
            <path
                d="M 60,5 C 25,5 5,25 5,60"
                stroke="url(#accentGlow)"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
};
