'use client';

import { useState } from 'react';
import { Brain, Zap, BarChart3, Shield, Cpu, TrendingUp } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: Brain,
    title: 'AI-Powered Recognition',
    shortDesc: 'Real-time waste classification',
    fullDesc: 'Advanced machine learning models that instantly recognize and classify waste materials with 98%+ accuracy.',
    stat: '98%',
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    id: 2,
    icon: Zap,
    title: 'Real-Time Processing',
    shortDesc: 'Lightning-fast analysis',
    fullDesc: 'Process thousands of images per minute with sub-100ms latency for instant waste categorization.',
    stat: '<100ms',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 3,
    icon: BarChart3,
    title: 'Compounding Data Network',
    shortDesc: 'Growing intelligence daily',
    fullDesc: 'Every sorted item improves the model. Our network learns continuously, getting smarter each day.',
    stat: '1M+',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 4,
    icon: Shield,
    title: 'ESG Reporting',
    shortDesc: 'Automated compliance',
    fullDesc: 'Generate comprehensive ESG reports automatically with carbon footprint tracking and impact metrics.',
    stat: '100%',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 5,
    icon: Cpu,
    title: 'Hardware Integration',
    shortDesc: 'Seamless deployment',
    fullDesc: 'Works with existing waste management infrastructure. Easy hardware integration with minimal setup.',
    stat: '0hrs',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 6,
    icon: TrendingUp,
    title: 'Scalable Infrastructure',
    shortDesc: 'Enterprise-ready',
    fullDesc: 'Built for scale from day one. Handle 1,000s of locations with unified monitoring and control.',
    stat: '∞',
    color: 'from-pink-500 to-emerald-500',
  },
];

export function WelcomeInteractiveFeatures() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-black via-black/80 to-black">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Waste Infrastructure</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Click any feature to explore the technology powering W.I.S.E.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isSelected = selectedId === feature.id;
            const isHovered = hoveredId === feature.id;

            return (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredId(feature.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(isSelected ? null : feature.id)}
                className={`group relative cursor-pointer transition-all duration-300 ${
                  isSelected ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                {/* Card background with gradient */}
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10
                  ${isHovered ? 'bg-gradient-to-br ' + feature.color : ''}
                  blur-xl`}
                />

                {/* Main card */}
                <div className={`relative h-full p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 overflow-hidden
                  ${isSelected || isHovered
                    ? 'bg-gray-900/80 border-emerald-500/50 shadow-lg'
                    : 'bg-gray-900/40 border-gray-700/50 hover:border-gray-600/50'
                  }
                `}>
                  {/* Animated background glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300
                    ${isHovered ? 'bg-gradient-to-br ' + feature.color : ''}
                  `} />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`mb-4 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300
                      ${isHovered ? 'bg-gradient-to-br ' + feature.color + ' text-white' : 'bg-gray-800 text-gray-400'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title and stat */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                      <span className={`text-sm font-mono font-bold ${
                        isHovered ? 'text-emerald-300' : 'text-gray-500'
                      }`}>
                        {feature.stat}
                      </span>
                    </div>

                    {/* Description */}
                    <div className={`transition-all duration-300 ${
                      isSelected ? 'block' : 'block md:hidden lg:block'
                    }`}>
                      <p className={`text-sm transition-colors duration-300 ${
                        isHovered || isSelected ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {isSelected || isHovered ? feature.fullDesc : feature.shortDesc}
                      </p>
                    </div>

                    {/* Indicator */}
                    <div className={`mt-4 w-1 h-8 rounded-full transition-all duration-300 ${
                      isHovered ? 'bg-gradient-to-b ' + feature.color + ' w-2' : 'bg-gray-600'
                    }`} />
                  </div>

                  {/* Click indicator for selected state */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info message */}
        <div className="mt-12 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-emerald-400 font-semibold">💡 Tip:</span> Click on any feature to learn more about how W.I.S.E. powers your waste intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}
