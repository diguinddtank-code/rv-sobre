import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, ExternalLink, MessageCircle } from 'lucide-react';
import { LinkItem } from '../types';

interface ProjectModalProps {
  item: LinkItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ item, isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll do corpo
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();
      
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" },
        "-=0.2"
      );

    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappMessage = encodeURIComponent(`Olá Rodrigo! Vi o projeto "${item.label}" no seu portfólio e gostaria de saber mais.`);
  const whatsappUrl = `https://wa.me/5531986669917?text=${whatsappMessage}`;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md opacity-0"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-3xl bg-[#080808] border border-[#00f0ff]/20 shadow-[0_0_50px_rgba(0,240,255,0.1)] relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-[#00f0ff] hover:text-black text-white transition-colors rounded-full backdrop-blur-md border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-[#111]">
           <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent z-10 md:hidden"></div>
           <img 
             src={item.image} 
             alt={item.label} 
             className="w-full h-full object-cover object-top opacity-90"
           />
           {/* Glitch Overlay Effect */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between relative bg-[#080808]">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f0ff]/5 blur-3xl rounded-full pointer-events-none"></div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                 <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse"></span>
                 <span className="text-xs font-['Space_Grotesk'] uppercase tracking-[0.2em] text-[#00f0ff]">
                   {item.category || 'PROJECT'}
                 </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-['Syncopate'] font-bold text-white uppercase leading-none mb-4">
                {item.label}
              </h2>
              
              <div className="h-[1px] w-12 bg-[#00f0ff]/30 mb-6"></div>
              
              <p className="font-['Space_Grotesk'] text-gray-400 text-sm leading-relaxed mb-8">
                {item.description || item.subLabel}
              </p>
            </div>

            <div className="flex flex-col gap-3">
               <a 
                 href={whatsappUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full py-4 bg-[#00f0ff] text-black font-['Space_Grotesk'] font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 group"
               >
                 <MessageCircle className="w-4 h-4" />
                 Falar no WhatsApp
               </a>
               
               <a 
                 href={item.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full py-4 bg-transparent border border-white/10 text-white/70 font-['Space_Grotesk'] font-bold uppercase tracking-widest text-xs hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2"
               >
                 <ExternalLink className="w-4 h-4" />
                 Ver Projeto
               </a>
            </div>
        </div>
      </div>
    </div>
  );
};