import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { label: "Experience", value: 10, suffix: " YEARS" }, // Value is number for animation
  { label: "Global Reach", value: 2, suffix: " COUNTRIES" }, // Simplified for counter
  { label: "Client Retention", value: 100, suffix: "%" },
];

export const Stats = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal container
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 1,
        scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
      });

      // Animate Numbers (Counter)
      STATS.forEach((stat, i) => {
        const obj = { val: 0 };
        const element = document.getElementById(`stat-val-${i}`);
        
        if (element) {
            gsap.to(obj, {
                val: stat.value,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
                onUpdate: () => {
                    // Update text, formatting as needed
                    let formatted = Math.floor(obj.val).toString();
                    if(stat.label === "Global Reach" && formatted === "2") formatted = "USA / BR";
                    element.innerText = formatted;
                }
            });
        }
      });

      // Expand Lines
      gsap.from(".stat-line", {
        scaleX: 0,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 90%" }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative py-12 md:py-16 mb-20 md:mb-32 bg-black/50 backdrop-blur-sm">
      <div className="stat-line absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent origin-center"></div>
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        {STATS.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="font-['Syncopate'] font-bold text-4xl md:text-5xl text-white mb-2 flex items-baseline justify-center gap-2">
               <span id={`stat-val-${i}`} className="text-white text-shadow-glow">0</span>
               <span className="text-[#00f0ff] text-sm md:text-xl font-normal">{stat.suffix}</span>
            </div>
            <div className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] text-white/40">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="stat-line absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent origin-center"></div>
    </div>
  );
};