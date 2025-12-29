import React from 'react';
import { Instagram, ArrowUpRight, Globe } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#030303] border-t border-white/10 pt-20 pb-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
            
            {/* CTA Section */}
            <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div>
                    <h2 className="font-['Syncopate'] font-bold text-4xl md:text-7xl uppercase leading-none mb-6">
                        Let's work <br/>
                        <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '1px #00f0ff' }}>Together</span>
                    </h2>
                    <p className="font-['Space_Grotesk'] text-white/40 max-w-md">
                        Transformando visões em realidade digital de alta performance. Vamos elevar o nível do seu projeto?
                    </p>
                </div>
                
                <a 
                  href="https://wa.me/5531986669917" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-8 py-4 bg-white text-black font-['Syncopate'] font-bold uppercase tracking-wider hover:bg-[#00f0ff] transition-colors duration-300"
                >
                    Start Project
                    <ArrowUpRight className="inline-block ml-2 w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            <div className="h-[1px] w-full bg-white/10 mb-16"></div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                {/* Brand */}
                <div className="col-span-1 md:col-span-2">
                    <div className="font-['Syncopate'] font-bold text-2xl mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#00f0ff]"></div>
                        RODRIGO VIEIRA
                    </div>
                    <p className="font-['Space_Grotesk'] text-white/30 text-sm max-w-xs">
                        Digital Agency & Creative Studio.
                        Belo Horizonte, MG — Brazil.
                        Available Worldwide.
                    </p>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#00f0ff] mb-6">Connect</h4>
                    <ul className="space-y-4 font-['Space_Grotesk'] text-sm text-white/60">
                        <li>
                            <a href="https://instagram.com/rodrigoviiiieira" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-2 group transition-colors">
                                <Instagram className="w-4 h-4 opacity-50 group-hover:opacity-100" /> @rodrigoviiiieira
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Status */}
                <div>
                    <h4 className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#00f0ff] mb-6">Status</h4>
                    <div className="flex flex-col gap-4 font-['Space_Grotesk'] text-sm text-white/60">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Accepting New Projects
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Remote / Async
                        </div>
                        <div className="text-white/20 text-xs mt-2">
                            Local Time: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-white/20">
                <p>© {currentYear} Remaking Agency.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Terms of Use</span>
                </div>
            </div>
        </div>
    </footer>
  );
};