import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

interface MarqueeProps {
  text: string;
  direction?: 'left' | 'right';
  speed?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({ text, direction = 'left', speed = 20 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    // Clone text for seamless loop
    const content = textEl.innerHTML;
    textEl.innerHTML = content + content + content + content;

    const moveDistance = textEl.offsetWidth / 4;
    
    gsap.to(textEl, {
      x: direction === 'left' ? -moveDistance : 0,
      duration: speed,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
         gsap.set(textEl, { x: 0 }); // Reset for seamless loop
      }
    });
  }, [direction, speed, text]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden border-y border-white/10 bg-[#00f0ff]/5 py-4 my-20 relative select-none">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div 
        ref={textRef} 
        className="whitespace-nowrap font-['Syncopate'] font-bold text-4xl md:text-6xl text-transparent stroke-text opacity-50 flex gap-8 items-center"
        style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)' }}
      >
        <span className="flex items-center gap-8">
           {text} <span className="text-[#00f0ff]">•</span>
        </span>
      </div>
    </div>
  );
};