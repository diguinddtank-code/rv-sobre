import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { LinkItem } from '../types';

interface KineticLinkProps {
  item: LinkItem;
  index: number;
}

export const KineticLink: React.FC<KineticLinkProps> = ({ item, index }) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useLayoutEffect(() => {
    // Revelação inicial em cascata
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1 + index * 0.1, ease: "power3.out" }
    );
  }, [index]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Efeito de tensão elástica no texto
    gsap.to(textRef.current, {
      scaleY: 1.1, // Menor distorção para não quebrar no mobile
      x: 10,
      color: "#00f0ff", 
      duration: 0.4,
      ease: "power2.out"
    });
    
    gsap.to(subTextRef.current, {
      x: 10,
      opacity: 0.8,
      duration: 0.3
    });

    // A imagem só aparece em telas maiores que mobile para não tapar o clique
    if (window.innerWidth > 768) {
        gsap.to(imageRef.current, {
          opacity: 0.4,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(textRef.current, {
      scaleY: 1,
      x: 0,
      color: "#ffffff",
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(subTextRef.current, {
      x: 0,
      opacity: 0.4,
      duration: 0.3
    });

    gsap.to(imageRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered || !imageRef.current || !containerRef.current || window.innerWidth <= 768) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Efeito sutil de seguimento
    gsap.to(imageRef.current, {
      x: x, 
      rotation: (x - rect.width / 2) * 0.02,
      duration: 1,
      ease: "power3.out"
    });
  };

  return (
    <a 
      href={item.url}
      ref={containerRef}
      className="relative block group py-5 md:py-6 border-b border-white/5 w-full hover:bg-white/5 transition-colors px-4 rounded-lg cursor-pointer no-underline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between relative z-10 pointer-events-none">
        <h2 
          ref={textRef}
          className="text-2xl md:text-5xl font-bold uppercase tracking-tight transition-colors font-['Syncopate'] text-white"
        >
          {item.label}
        </h2>
        <p 
          ref={subTextRef}
          className="text-xs md:text-sm text-white/40 font-['Space_Grotesk'] tracking-widest mt-1 md:mt-0"
        >
          {item.subLabel}
        </p>
      </div>

      {/* Imagem Flutuante (Apenas Desktop) */}
      <div className="hidden md:block absolute top-1/2 left-0 pointer-events-none z-0 overflow-visible w-full h-0">
          <img
            ref={imageRef}
            src={item.image}
            alt="Preview"
            className="absolute top-1/2 w-48 h-32 object-cover opacity-0 rounded-sm filter grayscale contrast-125 brightness-75 -translate-y-1/2"
          />
      </div>
    </a>
  );
};