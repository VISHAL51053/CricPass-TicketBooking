import React from 'react';
import type { Match, StandSection } from '../../types';
import { STADIUM_STANDS } from '../../data/stadiumConfig';
import { Layers, Eye } from 'lucide-react';

interface AllStandsInteractiveShowcaseProps {
  match: Match;
  onExploreStadium: (match: Match, stand: StandSection) => void;
}

export const AllStandsInteractiveShowcase: React.FC<AllStandsInteractiveShowcaseProps> = ({
  match,
  onExploreStadium
}) => {
  return (
    <section id="sectors" className="py-20 lg:py-28 bg-[#292929] text-[#F3EFE6] select-none border-t border-[#F3EFE6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-[#F3EFE6]/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E78260]/15 text-[#E78260] font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>COLOSSEUM SECTORS &amp; TIERS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-[#F3EFE6]">
              EXPLORE ALL 8 ARENA STANDS
            </h2>
          </div>
          <p className="text-xs text-[#F3EFE6]/70 max-w-sm mt-3 md:mt-0 font-normal leading-relaxed">
            Every stand has distinct 3D geometry, acoustic reverberation characteristics, and viewing angles relative to the pitch wickets.
          </p>
        </div>

        {/* 8 Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STADIUM_STANDS.map((stand) => (
            <div
              key={stand.id}
              className="rounded-2xl p-6 bg-[#F3EFE6]/5 border border-[#F3EFE6]/10 hover:border-[#E78260] hover:bg-[#F3EFE6]/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#E78260]/20 text-[#E78260]">
                    {stand.tier}
                  </span>
                  <span className="text-[10px] font-mono text-[#10b981] font-bold">
                    {stand.availableSeats} Available
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#F3EFE6] mb-2 leading-snug group-hover:text-[#E78260] transition-colors">
                  {stand.name}
                </h3>
                <p className="text-xs text-[#F3EFE6]/70 leading-relaxed mb-4 line-clamp-3">
                  {stand.description}
                </p>

                <div className="space-y-1.5 mb-6">
                  {stand.perks.slice(0, 2).map((perk, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#F3EFE6]/80 font-mono">
                      <span className="text-[#E78260]">✓</span>
                      <span className="truncate">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F3EFE6]/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono text-[#F3EFE6]/50 block">From</span>
                  <span className="text-lg font-black text-[#F3EFE6]">
                    ₹{stand.basePrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => onExploreStadium(match, stand)}
                  className="px-3.5 py-2 rounded-xl bg-[#E78260] hover:bg-[#d67252] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md group-hover:scale-105"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3D View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
