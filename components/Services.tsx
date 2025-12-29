import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Eye, BarChart3, Code2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_ITEMS = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Traffic Management",
    desc: "Estratégias de mídia paga focadas em ROI agressivo. Facebook, Google & TikTok Ads otimizados via dados.",
    tech: ["Meta Ads", "GA4", "Looker Studio"]
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Web Architecture",
    desc: "Sites de alta performance com React, Next.js e WebGL. Design que converte visitantes em clientes.",
    tech: ["React", "TypeScript", "Tailwind"]
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Automations",
    desc: "Sistemas inteligentes que trabalham por você. Integração de CRM, WhatsApp e Email Marketing.",
    tech: ["n8n", "Zapier", "OpenAI API"]
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Visual Identity",
    desc: "Criação de marcas com estética futurista e sólida. Do logotipo ao material de apoio completo.",
    tech: ["Photoshop", "Illustrator", "Figma"]
  }
];

export const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Construction Effect for Services
      // They slide in and "snap" into place
      gsap.from(".service-card", {
        y: 100,
        opacity: 0,
        rotateX: -15, // Tilt back
        scale: 0.9,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });
      
      // Animate the line separator
      gsap.from(".section-line", {
        scaleX: 0,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%"
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto px-4 md:px-8 mb-32 relative">
      
      {/* Decorative Line that draws itself */}
      <div className="section-line absolute -top-10 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent origin-left"></div>

      <div className="flex flex-col items-center mb-16 text-center">
         <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] text-[#00f0ff] mb-2">Capabilities</span>
         <h3 className="font-['Syncopate'] text-2xl md:text-4xl uppercase tracking-widest font-bold">Operational Modules</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICE_ITEMS.map((item, i) => (
          <div 
            key={i} 
            className="service-card group relative bg-[#0a0a0a] border border-white/10 p-8 hover:border-[#00f0ff]/50 transition-colors duration-300 overflow-hidden rounded-sm perspective-500"
          >
            {/* Background Hover Effect - Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700 ease-in-out"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-[#00f0ff] group-hover:text-white group-hover:bg-[#00f0ff] transition-colors group-hover:shadow-[0_0_15px_#00f0ff]">
                  {item.icon}
                </div>
                <span className="font-mono text-[9px] text-white/20">MOD_0{i+1}</span>
              </div>

              <h4 className="font-['Syncopate'] text-lg font-bold uppercase mb-3 group-hover:translate-x-2 transition-transform duration-300">
                {item.title}
              </h4>
              
              <p className="font-['Space_Grotesk'] text-white/50 text-sm leading-relaxed mb-6 group-hover:text-white/70 transition-colors">
                {item.desc}
              </p>

              <div className="mt-auto border-t border-white/5 pt-4 flex gap-2 flex-wrap">
                {item.tech.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono text-[#00f0ff]/70 bg-[#00f0ff]/5 px-2 py-1 rounded-sm border border-[#00f0ff]/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};