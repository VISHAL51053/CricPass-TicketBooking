import React from 'react';
import type { Match } from '../../types';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onSelectMatch: (match: Match) => void;
  onViewDetails?: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onSelectMatch,
  onViewDetails
}) => {
  const matchDate = new Date(match.dateTime);
  const isSellingFast = match.ticketStatus === 'Selling Fast' || match.ticketStatus === 'Almost Full';

  return (
    <div className="rounded-2xl border border-[#292929]/15 bg-[#F3EFE6] p-6 lg:p-7 flex flex-col justify-between shadow-md hover:shadow-2xl hover:border-[#E78260] transition-all duration-300 relative select-none group">
      {/* Top Accent Stripe with Team Colors */}
      <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-5">
        <div className="w-1/2" style={{ backgroundColor: match.teamA.primaryColor }} />
        <div className="w-1/2" style={{ backgroundColor: match.teamB.primaryColor }} />
      </div>

      <div>
        {/* Top Metadata */}
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="text-[#292929]/60 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            {isSellingFast && <Flame className="w-3.5 h-3.5 text-[#E78260]" />}
            {match.matchNumber} · {match.format}
          </span>
          <span
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
              isSellingFast
                ? 'bg-[#E78260] text-[#292929]'
                : 'bg-[#292929] text-[#F3EFE6]'
            }`}
          >
            {match.ticketStatus}
          </span>
        </div>

        {/* Teams Clash */}
        <div>
          <div className="text-2xl font-black tracking-tight text-[#292929] mb-1 flex items-center justify-between">
            <span>{match.teamA.shortName}</span>
            <span className="text-sm font-bold text-[#E78260] uppercase px-2 py-0.5 rounded bg-[#E78260]/15">
              VS
            </span>
            <span>{match.teamB.shortName}</span>
          </div>

          <p className="text-xs text-[#292929]/65 uppercase mb-5 font-semibold tracking-wide truncate">
            {match.teamA.name} vs {match.teamB.name}
          </p>

          {/* Details Pill */}
          <div className="space-y-2.5 py-3.5 px-4 rounded-xl bg-[#292929]/5 text-xs mb-5">
            <div className="flex justify-between items-center">
              <span className="text-[#292929]/60 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#E78260]" />
                Date
              </span>
              <span className="font-bold text-[#292929]">
                {matchDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#292929]/60 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E78260]" />
                Venue
              </span>
              <span className="font-bold text-[#292929] truncate max-w-[170px]" title={match.venue.name}>
                {match.venue.name}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#292929]/60 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E78260]" />
                Capacity
              </span>
              <span className="font-bold text-[#292929]">
                {match.venue.capacity.toLocaleString()} Seats
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Pricing & Action */}
      <div className="flex items-center justify-between pt-4 border-t border-[#292929]/10">
        <div>
          <span className="text-[10px] uppercase text-[#292929]/50 block font-semibold tracking-wider">
            Passes From
          </span>
          <span className="text-xl font-black text-[#292929]">
            ₹{match.minPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(match)}
              className="px-3 py-2 rounded-xl border border-[#292929]/20 text-[#292929] text-xs font-bold uppercase hover:bg-[#292929]/10 transition-colors"
            >
              Info
            </button>
          )}

          <button
            onClick={() => onSelectMatch(match)}
            className="px-4 py-2.5 rounded-xl bg-[#292929] group-hover:bg-[#E78260] text-[#F3EFE6] group-hover:text-[#292929] text-xs font-black uppercase transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-[#292929]/20 group-hover:shadow-[#E78260]/30"
          >
            <span>3D Seats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
