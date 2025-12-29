import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { label: "Experience", value: "10", suffix: " YEARS" },
  { label: "Global Reach", value: "USA / BR", suffix: "" },
  { label: "Client Retention", value: "100", suffix: "%" },
];

export const Stats = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full border-y border-white/10 bg-black/50 backdrop-blur-sm py-16 mb-32">
      <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="stat-item flex flex-col items-center text-center">
            <div className="font-['Syncopate'] font-bold text-4xl md:text-5xl text-white mb-2 flex items-baseline justify-center gap-2">
               <span className="text-[#00f0ff]">{stat.value}</span>
               <span className="text-white/50 text-xl">{stat.suffix}</span>
            </div>
            <div className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.3em] text-white/40">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};