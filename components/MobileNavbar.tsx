import React, { useState, useRef, useEffect } from 'react';
import { Home, Layers, Cpu, MessageCircle } from 'lucide-react';
import gsap from 'gsap';

export const MobileNavbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: 'services', icon: <Cpu className="w-5 h-5" />, label: 'Services' },
    { id: 'portfolio', icon: <Layers className="w-5 h-5" />, label: 'Work' },
    { id: 'contact', icon: <MessageCircle className="w-5 h-5" />, label: 'Contact' },
  ];

  useEffect(() => {
    // Initial Position of Indicator
    moveIndicator(0);
  }, []);

  const moveIndicator = (index: number) => {
    if (!indicatorRef.current || !containerRef.current) return;
    
    // Calculate position: (100% / 4 items) * index
    const widthPercentage = 100 / navItems.length;
    
    gsap.to(indicatorRef.current, {
      left: `${index * widthPercentage}%`,
      width: `${widthPercentage}%`,
      duration: 0.5,
      ease: "elastic.out(1, 0.75)"
    });
  };

  const handleNavClick = (id: string, index: number) => {
    setActiveTab(id);
    moveIndicator(index);

    // Scroll Logic
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    // Icon Pop Animation
    gsap.fromTo(`.icon-${id}`, 
      { scale: 0.8, rotate: -10 },
      { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(2)" }
    );
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
      <div 
        ref={containerRef}
        className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl h-16 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center overflow-hidden"
      >
        {/* Sliding Liquid Indicator */}
        <div 
          ref={indicatorRef}
          className="absolute top-1 bottom-1 bg-[#00f0ff]/10 rounded-xl border border-[#00f0ff]/20 shadow-[0_0_15px_rgba(0,240,255,0.1)] z-0"
          style={{ width: '25%' }}
        ></div>

        {/* Nav Items */}
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id, index)}
            className="relative z-10 flex-1 flex flex-col items-center justify-center h-full gap-1 active:scale-90 transition-transform duration-100"
          >
            <div className={`icon-${item.id} transition-colors duration-300 ${activeTab === item.id ? 'text-[#00f0ff]' : 'text-white/40'}`}>
              {item.icon}
            </div>
            
            {activeTab === item.id && (
                <span className="text-[9px] font-['Space_Grotesk'] uppercase tracking-wider text-[#00f0ff] animate-in fade-in slide-in-from-bottom-2 duration-300 absolute -bottom-1 opacity-0 scale-0">
                   {/* Optional: Add label if desired, but kept minimal for clean look */}
                </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};