import React, { useEffect, useRef, useState } from 'react';
import { ProjectCard } from './components/ProjectCard';
import { CustomCursor } from './components/CustomCursor';
import { ParticleBackground } from './components/ParticleBackground';
import { Services } from './components/Services';
import { Stats } from './components/Stats';
import { Marquee } from './components/Marquee';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { MobileNavbar } from './components/MobileNavbar'; // Import Navbar
import { LINKS } from './constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GlitchTitle = () => {
  return (
    <div className="relative inline-block group">
       <h1 className="font-['Syncopate'] font-bold text-4xl md:text-7xl tracking-tighter uppercase mb-2 leading-none relative z-10 mix-blend-difference">
          Rodrigo<br/>Vieira
       </h1>
       {/* Glitch Layers */}
       <h1 className="absolute top-0 left-0 font-['Syncopate'] font-bold text-4xl md:text-7xl tracking-tighter uppercase mb-2 leading-none text-[#00f0ff] opacity-0 group-hover:opacity-70 animate-pulse translate-x-[2px]">
          Rodrigo<br/>Vieira
       </h1>
       <h1 className="absolute top-0 left-0 font-['Syncopate'] font-bold text-4xl md:text-7xl tracking-tighter uppercase mb-2 leading-none text-red-500 opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[2px]">
          Rodrigo<br/>Vieira
       </h1>
    </div>
  );
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isLoading) return; // Wait for preloader

    const ctx = gsap.context(() => {
      // Intro Animation
      const tl = gsap.timeline();

      // 1. Revelar Foto
      tl.fromTo(imageRef.current, 
        { scale: 0.9, opacity: 0, filter: "blur(10px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
      );

      // 2. Revelar Texto Header
      tl.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.8"
      );
      
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      <div ref={containerRef} className="relative min-h-screen w-full bg-[#050505] text-white selection:bg-[#00f0ff] selection:text-black overflow-x-hidden">
        
        {/* 1. Fundo de Partículas Interativo (com conexões) */}
        <ParticleBackground />
        
        {/* 2. Cursor Personalizado (Desktop) */}
        <div className="hidden md:block">
          <CustomCursor />
        </div>

        {/* 3. Conteúdo Principal */}
        <main className="relative z-10 min-h-screen flex flex-col items-center py-20 pb-0">
          
          {/* Section ID for Nav */}
          <div id="home" className="absolute top-0"></div>

          {/* Header do Perfil */}
          <header className="flex flex-col items-center text-center mb-32 max-w-4xl mx-auto w-full px-4">
            
            {/* Imagem Limpa e Sofisticada (Sem neon excessivo/spin) */}
            <div className="relative w-32 h-32 md:w-56 md:h-56 mb-10 group cursor-pointer">
              
              {/* Moldura sutil */}
              <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-[#00f0ff]/50 transition-colors duration-500"></div>
              
              {/* Imagem */}
              <div className="w-full h-full rounded-full overflow-hidden relative z-10 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#111]">
                    <img 
                        ref={imageRef}
                        src="https://i.imgur.com/Sp5Vg69.png" 
                        alt="Rodrigo Vieira"
                        className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                  </div>
              </div>

              {/* Status Badge Minimalista */}
              <div className="absolute -bottom-2 -right-2 bg-[#0a0a0a] border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl z-20">
                <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
                <span className="text-[9px] font-['Space_Grotesk'] uppercase tracking-widest text-white/60">Online</span>
              </div>
            </div>

            <div ref={headerRef} className="opacity-0">
              <GlitchTitle />
              
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent mx-auto my-6"></div>

              <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-['Space_Grotesk'] text-xs md:text-sm text-white/50 tracking-widest uppercase">
                <span className="hover:text-white transition-colors cursor-default">Gestão de Tráfego</span>
                <span className="text-[#00f0ff]">•</span>
                <span className="hover:text-white transition-colors cursor-default">Web Design</span>
                <span className="text-[#00f0ff]">•</span>
                <span className="hover:text-white transition-colors cursor-default">Vídeo Maker</span>
                <span className="text-[#00f0ff]">•</span>
                <span className="hover:text-white transition-colors cursor-default">Automações</span>
              </div>
            </div>
          </header>

          {/* NOVA SEÇÃO: Estatísticas Simplificadas */}
          <Stats />

          {/* NOVA SEÇÃO: Serviços (Capabilities) */}
          <div id="services" className="scroll-mt-20 w-full">
             <Services />
          </div>

          {/* Separador Marquee */}
          <Marquee text="DIGITAL EXPERIENCE • HIGH PERFORMANCE • TRAFFIC • DESIGN" />

          {/* Feed de Projetos (Scroll Reveal) */}
          <div id="portfolio" className="w-full max-w-6xl flex flex-col items-center px-4 md:px-8 mt-20 mb-20 scroll-mt-20">
            <div className="mb-20 flex flex-col items-center gap-2 opacity-60">
               <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] text-[#00f0ff]">Portfolio</span>
               <h3 className="font-['Syncopate'] text-xl uppercase tracking-widest">Selected Works</h3>
               <div className="h-10 w-[1px] bg-gradient-to-b from-[#00f0ff] to-transparent mt-2"></div>
            </div>

            {LINKS.map((item, index) => (
              <ProjectCard key={item.id} item={item} index={index} />
            ))}
          </div>

          {/* Separador Marquee Final */}
           <Marquee text="LET'S BUILD THE FUTURE • OPEN FOR NEW PROJECTS • CONTACT NOW" direction="right" />

          {/* Footer Dedicado com ID para Navegação */}
          <div id="contact" className="w-full">
             <Footer />
          </div>
          
        </main>
        
        {/* Mobile Navbar (Dock) */}
        <MobileNavbar />

      </div>
    </>
  );
};

export default App;