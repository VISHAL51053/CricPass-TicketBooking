import React from 'react';
import type { Match, StandSection } from '../../types';
import { STADIUM_STANDS } from '../../data/stadiumConfig';
import { Crown, Utensils, ShieldCheck, ArrowRight, Compass } from 'lucide-react';

interface VIPHospitalityExperienceProps {
  match: Match;
  onExploreStadium: (match: Match, stand: StandSection) => void;
  onBookVIP: (match: Match, stand: StandSection) => void;
}

export const VIPHospitalityExperience: React.FC<VIPHospitalityExperienceProps> = ({
  match,
  onExploreStadium,
  onBookVIP
}) => {
  const vipStand = STADIUM_STANDS[0]; // Presidential Pavilion

  return (
    <section className="py-20 lg:py-28 bg-[#181a20] text-[#F3EFE6] select-none border-t border-[#F3EFE6]/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E78260]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-[#E78260]/30 bg-gradient-to-br from-[#242730] to-[#1c1e24] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: VIP Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E78260]/20 text-[#E78260] font-bold text-xs uppercase tracking-wider font-mono">
                <Crown className="w-3.5 h-3.5" />
                <span>EXCLUSIVE HOSPITALITY ENCLAVE</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F3EFE6] leading-tight">
                PRESIDENTIAL PAVILION &amp; ROYAL SUITES
              </h2>

              <p className="text-sm text-[#F3EFE6]/80 leading-relaxed font-normal max-w-xl">
                Experience international cricket from the most prestigious address in world sports. Private air-conditioned glass suites, dedicated sommelier service, and close proximity to the player dugout.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <Utensils className="w-5 h-5 text-[#E78260] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F3EFE6] uppercase">Gourmet Five-Star Dining</h4>
                    <p className="text-[11px] text-[#F3EFE6]/60 mt-0.5">Live culinary stations and artisan beverage service throughout all sessions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-[#E78260] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F3EFE6] uppercase">Fast-Track Gate 01 Valet</h4>
                    <p className="text-[11px] text-[#F3EFE6]/60 mt-0.5">Dedicated VIP subterranean parking with direct private elevator ingress.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => onBookVIP(match, vipStand)}
                  className="px-6 py-3.5 rounded-xl bg-[#E78260] hover:bg-[#d67252] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#E78260]/30 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>RESERVE VIP PASS (FROM ₹15,000)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onExploreStadium(match, vipStand)}
                  className="px-5 py-3 rounded-xl bg-transparent hover:bg-white/10 text-[#F3EFE6] border border-white/20 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#E78260]" />
                  <span>Inspect Pavilion POV</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Specs Display */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-[#292929] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono font-bold text-[#E78260] uppercase">ACCREDITATION DOSSIER</span>
                  <span className="text-xs font-bold text-[#10b981]">● LIMITED TO 48 SEATS</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#F3EFE6]/60">Terrace Vantage:</span>
                    <span className="font-bold text-[#F3EFE6]">South End Wicket Axis</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F3EFE6]/60">Pitch Distance:</span>
                    <span className="font-bold text-[#F3EFE6]">28.5m Direct Sightline</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F3EFE6]/60">Line of Sight:</span>
                    <span className="font-bold text-[#10b981]">100% Pillarless Clearance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F3EFE6]/60">Turnstile Ingress:</span>
                    <span className="font-bold text-[#F3EFE6]">Gate 01 Presidential Corridor</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#E78260]/10 border border-[#E78260]/20 text-center">
                  <span className="text-[10px] font-mono text-[#E78260] font-bold block mb-0.5">INCLUDES AUTHENTIC MEMORABILIA</span>
                  <span className="text-xs text-[#F3EFE6]">Framed tournament match programme &amp; signed team ball</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
