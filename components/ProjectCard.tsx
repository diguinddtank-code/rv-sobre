import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LinkItem } from '../types';
import { ArrowUpRight, Plus } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  item: LinkItem;
  index: number;
}

const ScrambleText = ({ text, trigger }: { text: string, trigger: boolean }) => {
  const [display, setDisplay] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#";
  
  useEffect(() => {
    if (!trigger) {
      setDisplay(text);
      return;
    }
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((letter, index) => {
        if (index < iterations) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, text]);
  return <span>{display}</span>;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ item, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 100, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 95%",
            end: "top 60%",
            scrub: 1,
          }
        }
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -1.5;
    const rotateY = ((x - centerX) / centerX) * 1.5;

    gsap.to(containerRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (containerRef.current) {
        gsap.to(containerRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    }
  };

  return (
    <>
      <div ref={cardRef} className="w-full mb-16 md:mb-24 px-4 md:px-0 perspective-1000">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="group block relative w-full max-w-5xl mx-auto cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Glow de fundo - Quadrado */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f0ff] via-purple-600 to-[#00f0ff] opacity-0 group-hover:opacity-40 transition duration-500 blur-sm"></div>
          
          {/* Container Principal - Brutalista / Quadrado */}
          <div 
            ref={containerRef}
            className="relative w-full bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl transition-all duration-200 rounded-sm"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Spotlight Overlay */}
            <div 
               className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
               style={{
                   background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)`
               }}
            />

            {/* Header Tech */}
            <div className="h-8 bg-black/90 border-b border-white/10 flex items-center justify-between px-4 backdrop-blur-md z-20 relative">
              <div className="flex gap-2 items-center">
                 <div className="w-1.5 h-1.5 bg-[#00f0ff]"></div>
                 <span className="text-[9px] font-mono text-[#00f0ff] tracking-widest">SYSTEM.VIEWER</span>
              </div>
              <div className="text-[9px] font-mono text-white/30 tracking-widest">
                ID: {item.id.toUpperCase()}
              </div>
            </div>

            {/* Container da Imagem */}
            <div className="relative w-full overflow-hidden bg-[#111] border-b border-white/5">
               <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
               
               <div ref={imageRef} className="w-full relative group-hover:scale-[1.01] transition-transform duration-700 ease-out">
                 <picture>
                    <source media="(max-width: 768px)" srcSet={item.mobileImage} />
                    <img 
                      src={item.image} 
                      alt={item.label}
                      className="w-full 
                        aspect-[9/16] md:aspect-[16/9] 
                        object-cover object-top 
                        filter grayscale group-hover:grayscale-0 contrast-[1.1] brightness-[0.9] group-hover:brightness-100
                        transition-all duration-700"
                    />
                 </picture>
               </div>
               
               {/* Overlay Click Hint */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/40 backdrop-blur-[2px]">
                   <div className="bg-[#00f0ff] text-black px-6 py-2 font-['Syncopate'] font-bold text-xs uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Ver Detalhes
                   </div>
               </div>
            </div>

            {/* Informações */}
            <div className="relative z-20 bg-[#050505] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group-hover:bg-[#080808] transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-3">
                   <div className="px-2 py-0.5 border border-[#00f0ff]/30 bg-[#00f0ff]/5">
                     <span className="text-[9px] font-['Space_Grotesk'] uppercase tracking-widest text-[#00f0ff]">
                       {item.category || 'PROJECT'}
                     </span>
                   </div>
                </div>
                <h2 className="text-xl md:text-3xl font-['Syncopate'] font-bold text-white uppercase leading-none tracking-tight mb-2">
                  <ScrambleText text={item.label} trigger={isHovered} />
                </h2>
                <p className="text-white/40 font-['Space_Grotesk'] text-xs md:text-sm max-w-lg tracking-wide leading-relaxed">
                  {item.subLabel}
                </p>
              </div>

              <div className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors rounded-sm">
                   <Plus className="w-5 h-5" />
              </div>
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