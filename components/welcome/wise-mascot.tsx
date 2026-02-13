'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type MascotExpression = 'happy' | 'thinking' | 'celebrating' | 'curious';

export function WiseMascot() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expression, setExpression] = useState<MascotExpression>('happy');
  const [isClicked, setIsClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Track mouse position for eye-following effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mascotRef.current) {
        const rect = mascotRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const distance = 8;
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMascotClick = () => {
    setIsClicked(true);
    setClickCount(prev => prev + 1);
    
    // Cycle through expressions based on click count
    const expressions: MascotExpression[] = ['happy', 'thinking', 'celebrating', 'curious'];
    setExpression(expressions[clickCount % expressions.length]);
    
    setTimeout(() => setIsClicked(false), 300);
  };

  const getExpressionEmoji = () => {
    switch(expression) {
      case 'thinking': return '🤔';
      case 'celebrating': return '🎉';
      case 'curious': return '👀';
      default: return '😊';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Click counter */}
      {clickCount > 0 && (
        <div className="mb-4 text-emerald-400 text-sm font-mono">
          clicks: {clickCount}
        </div>
      )}
      
      {/* Mascot container */}
      <div
        ref={mascotRef}
        onClick={handleMascotClick}
        className={`relative cursor-pointer transition-transform duration-300 ${
          isClicked ? 'scale-95' : 'scale-100 hover:scale-105'
        }`}
      >
        {/* Animated glow background */}
        <div className="absolute inset-0 -z-10 animate-pulse">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl"></div>
        </div>

        {/* Floating animation wrapper */}
        <div className="animate-float">
          {/* Mascot image */}
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <Image
              src="/images/wise-mascot.png"
              alt="W.I.S.E. Mascot"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Left eye light effect */}
        <div
          className="absolute top-24 left-24 md:top-32 md:left-32 w-3 h-3 bg-emerald-300 rounded-full blur-sm transition-all duration-75"
          style={{
            transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
          }}
        />

        {/* Right eye light effect */}
        <div
          className="absolute top-24 right-24 md:top-32 md:right-32 w-3 h-3 bg-emerald-300 rounded-full blur-sm transition-all duration-75"
          style={{
            transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
          }}
        />

        {/* Expression indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-2xl opacity-0 animate-pop">
          {getExpressionEmoji()}
        </div>
      </div>

      {/* Interactive hint */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm animate-pulse">
          Click W.I.S.E. to see expressions • {clickCount > 0 && `${4 - (clickCount % 4)} more`}
        </p>
      </div>

      {/* Easter egg message */}
      {clickCount > 10 && (
        <div className="mt-6 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm text-center animate-fadeIn">
          🤖 W.I.S.E. says: "Keep clicking to unlock more secrets!"
        </div>
      )}

      {clickCount > 20 && (
        <div className="mt-4 px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm text-center animate-slideIn">
          ✨ Secret unlocked: You're now a W.I.S.E. enthusiast! Share your clicks with others.
        </div>
      )}
    </div>
  );
}
