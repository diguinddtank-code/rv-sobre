import React, { useState, useRef, useEffect } from 'react';
import { generateConciergeResponse } from '../services/geminiService';
import { X, Send } from 'lucide-react';
import gsap from 'gsap';

interface ConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Concierge: React.FC<ConciergeProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" }
      );
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse(''); // Clear previous
    const aiRes = await generateConciergeResponse(query);
    setResponse(aiRes);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="w-full max-w-md bg-[#0a0a0a] border border-[#00f0ff]/30 p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative rounded-lg"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-[#00f0ff] font-['Syncopate'] text-xs tracking-widest mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00f0ff] animate-pulse rounded-full"></span>
          SISTEMA AURA_
        </h3>

        <div className="min-h-[80px] mb-6 font-['Space_Grotesk'] text-sm text-gray-300 leading-relaxed">
            {loading ? (
              <span className="animate-pulse text-[#00f0ff]">Analisando requisição...</span>
            ) : response ? (
              <span className="typing-effect">{response}</span>
            ) : (
              <span className="text-white/30">Como posso ajudar com os serviços da Remaking Agency?</span>
            )}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pergunte sobre Web, Design..."
            className="w-full bg-white/5 border-b border-white/20 p-3 pr-10 outline-none text-white focus:border-[#00f0ff] transition-colors font-['Space_Grotesk'] text-sm rounded-t-md"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#00f0ff]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};