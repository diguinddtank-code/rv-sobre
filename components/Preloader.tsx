import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out transition
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: onComplete
        });
      }
    });

    // Simulate loading progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 5) + 1;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setProgress(currentProgress);
    }, 30);

    // Text animations
    const texts = ["INITIALIZING...", "LOADING ASSETS...", "CONNECTING TO SERVER...", "SYSTEM READY"];
    texts.forEach((text, i) => {
        const duration = 0.5;
        tl.to(textRef.current, {
            opacity: 0,
            duration: 0.1,
            onComplete: () => {
                if (textRef.current) textRef.current.innerText = text;
            }
        })
        .to(textRef.current, {
            opacity: 1,
            duration: 0.1,
        })
        .to({}, { duration: 0.3 }); // wait
    });

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center text-white">
      <div className="w-64 mb-4 relative">
         <div className="h-[1px] bg-white/20 w-full absolute top-1/2"></div>
         <div 
            className="h-[2px] bg-[#00f0ff] absolute top-1/2 transition-all duration-100 ease-linear shadow-[0_0_10px_#00f0ff]" 
            style={{ width: `${progress}%` }}
         ></div>
      </div>
      
      <div className="flex justify-between w-64 font-mono text-xs text-[#00f0ff]">
         <div ref={textRef}>SYSTEM BOOT</div>
         <div>{progress}%</div>
      </div>

      <div className="absolute bottom-10 text-[10px] text-white/20 font-mono tracking-widest">
         REMAKING AGENCY © 2024
      </div>
    </div>
  );
};