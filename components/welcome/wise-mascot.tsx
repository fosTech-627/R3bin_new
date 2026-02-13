'use client';

export function WiseMascot() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Mascot container */}
      <div className="relative">
        {/* Animated glow background */}
        <div className="absolute inset-0 -z-10 animate-pulse">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl"></div>
        </div>

        {/* Floating animation wrapper */}
        <div className="animate-float">
          {/* FOSTRIDE Logo SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 375 375"
            className="w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Logo content - simplified clean display */}
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Background circle */}
            <circle cx="187.5" cy="187.5" r="180" fill="none" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.3" />

            {/* Main logo circle */}
            <circle cx="187.5" cy="187.5" r="170" fill="#0f172a" stroke="url(#logoGradient)" strokeWidth="1.5" />

            {/* Logo text or symbol - using a simple F */}
            <text
              x="187.5"
              y="200"
              fontSize="120"
              fontWeight="bold"
              textAnchor="middle"
              fill="url(#logoGradient)"
              fontFamily="Arial, sans-serif"
            >
              F
            </text>

            {/* Decorative elements */}
            <circle cx="187.5" cy="187.5" r="160" fill="none" stroke="url(#logoGradient)" strokeWidth="0.5" opacity="0.2" />
          </svg>
        </div>
      </div>

      {/* Brand tagline */}
      <div className="mt-8 text-center">
        <p className="text-emerald-300 text-sm font-semibold tracking-widest uppercase">
          W.I.S.E. Engine
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Waste Intelligent Sorting Engine
        </p>
      </div>
    </div>
  );
}
