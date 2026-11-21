import React from 'react';
import type { Match } from '../../types';
import { Compass, Ticket, ArrowRight } from 'lucide-react';

interface FinalArenaCTAProps {
  match: Match;
  onExploreStadium: (match: Match) => void;
  onBookTickets: (match: Match) => void;
}

export const FinalArenaCTA: React.FC<FinalArenaCTAProps> = ({
  match,
  onExploreStadium,
  onBookTickets
}) => {
  return (
    <section className="py-24 lg:py-32 bg-[#292929] text-[#F3EFE6] select-none border-t border-[#F3EFE6]/10 relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-radial from-[#E78260]/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="text-xs uppercase tracking-widest text-[#E78260] font-mono font-bold block mb-4">
          YOUR SEAT IN CRICKET HISTORY AWAITS
        </span>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#F3EFE6] leading-none mb-6">
          STEP INTO THE ARENA. <br />
          <span className="text-[#E78260]">SEE YOUR EXACT VIEW.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#F3EFE6]/75 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Join 132,000 passionate cricket fans at Narendra Modi Stadium. Select your seat in full 3D spatial perspective and reserve certified turnstile passes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onExploreStadium(match)}
            className="w-full sm:w-auto py-4 px-8 rounded-xl bg-transparent hover:bg-[#F3EFE6]/10 text-[#F3EFE6] border border-[#F3EFE6]/25 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#E78260]" />
            <span>EXPLORE 3D ARENA</span>
          </button>

          <button
            onClick={() => onBookTickets(match)}
            className="w-full sm:w-auto py-4 px-10 rounded-xl bg-[#E78260] hover:bg-[#d67252] text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-[#E78260]/30 hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Ticket className="w-4 h-4" />
            <span>BOOK TICKETS (FROM ₹2,500)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
