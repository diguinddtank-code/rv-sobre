import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LinkItem } from '../types';
import { Plus, ArrowRight } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  item: LinkItem;
  index: number;
}

// Componente de Texto Decodificado (Cyberpunk Style)
const ScrambleText = ({ text, trigger, className }: { text: string, trigger: boolean, className?: string }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#&+-"; 
  
  useEffect(() => {
    if (!trigger) return;
    
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((letter, index) => {
        if (index < iterations) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1; // Mais rápido para impacto imediato
    }, 30);
    
    return () => clearInterval(interval);
  }, [trigger, text]);
  
  return <span className={className}>{display}</span>;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ item, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const scannerLineRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%", // Dispara quando o topo do card está a 80% da tela
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          onEnter: () => setIsVisible(true),
        }
      });

      // 1. Efeito "Holographic Scanner" (Funciona muito bem no mobile)
      // O container começa "fechado" (clip-path no topo) e abre para baixo
      tl.fromTo(containerRef.current, 
        { 
          clipPath: "inset(0 0 100% 0)", // Escondido (cortado de baixo pra cima)
          opacity: 0
        }, 
        { 
          clipPath: "inset(0 0 0% 0)", // Totalmente visível
          opacity: 1,
          duration: 1.2,
          ease: "power3.inOut"
        }
      );

      // 2. A linha de Scanner acompanha o corte
      tl.fromTo(scannerLineRef.current,
        { top: "0%", opacity: 1 },
        { top: "100%", opacity: 0, duration: 1.2, ease: "power3.inOut" },
        "<" // Começa junto com o clipPath
      );

      // 3. Imagem faz um Zoom Out sutil (efeito de profundidade)
      tl.fromTo(imgRef.current,
        { scale: 1.2, filter: "grayscale(100%) brightness(2)" }, // Começa grande e estourada
        { scale: 1, filter: "grayscale(100%) brightness(0.9)", duration: 1.4, ease: "power2.out" },
        "<"
      );

      // 4. Elementos de UI entram depois (Tech slide in)
      tl.from(".tech-ui-element", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.5");

    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={cardRef} className="w-full mb-16 md:mb-32 px-0 md:px-0">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="group block relative w-full max-w-5xl mx-auto cursor-pointer"
        >
          {/* Main Card Container */}
          <div 
            ref={containerRef}
            className="relative w-full bg-[#080808] overflow-hidden border-y border-white/10 md:border md:rounded-sm md:border-white/10"
          >
            {/* --- SCANNER LINE EFFECT --- */}
            <div 
                ref={scannerLineRef}
                className="absolute left-0 right-0 h-[2px] bg-[#00f0ff] z-50 shadow-[0_0_20px_#00f0ff,0_0_40px_#00f0ff] pointer-events-none"
            ></div>

            {/* Header Tech (Mobile Optimized) */}
            <div className="h-10 bg-black/80 flex items-center justify-between px-4 border-b border-white/5 relative z-20 tech-ui-element">
              <div className="flex gap-2 items-center">
                 <div className="w-1.5 h-1.5 bg-[#00f0ff] animate-pulse rounded-full shadow-[0_0_5px_#00f0ff]"></div>
                 <span className="text-[10px] font-mono text-[#00f0ff] tracking-widest">
                    SYSTEM.LOADED
                 </span>
              </div>
              <div className="text-[9px] font-mono text-white/30 tracking-widest bg-white/5 px-2 py-1 rounded">
                ID: {item.id.toUpperCase()}
              </div>
            </div>

            {/* Image Area */}
            <div ref={imageContainerRef} className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-[#111]">
               {/* Noise Overlay */}
               <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
               
               <img 
                 ref={imgRef}
                 src={item.image} 
                 alt={item.label}
                 className="w-full h-full object-cover object-top"
               />

                {/* Mobile "Tap to Open" Hint */}
               <div className="absolute bottom-4 right-4 z-20 md:hidden flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10 rounded-full tech-ui-element">
                  <span className="text-[9px] text-white uppercase tracking-widest">Open</span>
                  <ArrowRight className="w-3 h-3 text-[#00f0ff]" />
               </div>
            </div>

            {/* Info Area (Always visible content for Mobile) */}
            <div className="relative z-20 bg-[#050505] p-6 flex flex-col gap-4 border-t border-white/5">
              
              <div className="flex justify-between items-start tech-ui-element">
                  <div>
                    <div className="inline-block px-2 py-1 border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-3 rounded-sm">
                        <span className="text-[9px] font-['Space_Grotesk'] uppercase tracking-[0.2em] text-[#00f0ff]">
                        {item.category || 'PROJECT'}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-['Syncopate'] font-bold text-white uppercase leading-none tracking-tight">
                        <ScrambleText text={item.label} trigger={isVisible} />
                    </h2>
                  </div>

                  <div className="hidden md:flex w-12 h-12 border border-white/10 items-center justify-center group-hover:bg-[#00f0ff] group-hover:border-[#00f0ff] group-hover:text-black transition-all duration-300">
                    <Plus className="w-6 h-6" />
                  </div>
              </div>

              <p className="text-white/50 font-['Space_Grotesk'] text-sm leading-relaxed max-w-xl tech-ui-element">
                {item.subLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal 
        item={item} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};