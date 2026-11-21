import React from 'react';
import type { Match } from '../../types';
import { STADIUM_STANDS } from '../../data/stadiumConfig';
import { X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useModalFocus } from '../../hooks/useModalFocus';

interface MatchDetailsModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking: (match: Match) => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  match,
  isOpen,
  onClose,
  onProceedToBooking
}) => {
  const dialogRef = useModalFocus<HTMLDivElement>(isOpen && Boolean(match), onClose);
  if (!isOpen || !match) return null;

  const matchDate = new Date(match.dateTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292929]/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono select-none">
      <div ref={dialogRef} tabIndex={-1} className="relative w-full max-w-2xl border border-[#292929] bg-[#F3EFE6] shadow-[8px_8px_0px_#292929] overflow-hidden max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="cp-match-dialog-title">
        {/* Header */}
        <div className="p-6 border-b border-[#292929] bg-[#292929] text-[#F3EFE6] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E78260] text-[#F3EFE6]">
                {match.tournament} · {match.format}
              </span>
              <span className="text-xs text-[#F3EFE6]/70">{match.matchNumber}</span>
            </div>
            <h2 id="cp-match-dialog-title" className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#F3EFE6] mt-1">
              {match.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close match details"
            className="p-1 border border-[#F3EFE6]/30 hover:border-[#F3EFE6] text-[#F3EFE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Head to Head Card */}
          <div className="p-4 border border-[#292929] bg-[#292929]/5 flex items-center justify-around">
            <div className="flex flex-col items-center text-center">
              <span className="font-serif text-3xl font-black text-[#292929]">{match.teamA.shortName}</span>
              <span className="font-bold text-[#292929] text-sm mt-1">{match.teamA.name}</span>
              <span className="text-[10px] text-[#E78260] font-bold">ICC RANK #{match.teamA.ranking}</span>
            </div>

            <div className="text-center">
              <div className="w-9 h-9 border border-[#292929] flex items-center justify-center font-bold text-xs text-[#292929] bg-[#F3EFE6] shadow-[1px_1px_0px_#292929] mx-auto">
                VS
              </div>
              <span className="text-[9px] text-[#292929]/60 uppercase mt-1 block">AXIS CLASH</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="font-serif text-3xl font-black text-[#292929]">{match.teamB.shortName}</span>
              <span className="font-bold text-[#292929] text-sm mt-1">{match.teamB.name}</span>
              <span className="text-[10px] text-[#292929]/70 font-bold">ICC RANK #{match.teamB.ranking}</span>
            </div>
          </div>

          {/* Schedule & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 border border-[#292929]/30 space-y-1">
              <div className="flex items-center gap-2 text-[#E78260] font-bold uppercase tracking-wider text-[10px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>SCHEDULE</span>
              </div>
              <div className="font-bold text-[#292929] text-sm">
                {matchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-[#292929]/70">
                GATES: 3 HOURS PRIOR · FIRST BALL: {matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} IST
              </div>
            </div>

            <div className="p-3.5 border border-[#292929]/30 space-y-1">
              <div className="flex items-center gap-2 text-[#E78260] font-bold uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>VENUE SPECIFICATION</span>
              </div>
              <div className="font-bold text-[#292929] text-sm truncate">{match.venue.name}</div>
              <div className="text-[#292929]/70">
                {match.venue.city} · Capacity: {match.venue.capacity.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Pitch Report */}
          <div className="p-3.5 border border-[#292929]/30 space-y-1">
            <span className="text-[10px] text-[#E78260] font-bold uppercase block">
              OFFICIAL PITCH &amp; METEOROLOGICAL BRIEF
            </span>
            <div className="text-[#292929]">
              <strong className="text-[#292929]">Pitch Assessment:</strong> {match.pitchReport}
            </div>
            <div className="text-[#292929]/70 text-[11px]">
              Weather: {match.weatherForecast}
            </div>
          </div>

          {/* Available Stands */}
          <div>
            <span className="text-xs font-bold text-[#292929] uppercase tracking-wider block mb-2">
              Available Arena Sectors:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STADIUM_STANDS.map((s) => (
                <div key={s.id} className="p-2 border border-[#292929]/30 bg-[#F3EFE6] text-xs">
                  <div className="font-bold text-[#292929] truncate">{s.name}</div>
                  <div className="text-[#E78260] font-bold text-[11px]">₹{s.basePrice.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-5 border-t border-[#292929] bg-[#292929]/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#292929]/60 uppercase block">ENTRY PASSES FROM</span>
            <span className="text-xl font-black text-[#E78260]">
              ₹{match.minPrice.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onProceedToBooking(match);
            }}
            className="px-6 py-3 bg-[#E78260] hover:bg-[#E78260]/90 text-[#F3EFE6] font-mono text-xs uppercase tracking-widest font-bold border border-[#292929] transition-transform active:translate-y-0.5 shadow-[2px_2px_0px_#292929] flex items-center gap-2"
          >
            <span>ENTER 3D STADIUM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
