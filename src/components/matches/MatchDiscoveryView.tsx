import React, { useState, useMemo } from 'react';
import type { Match } from '../../types';
import { MATCHES_DATA } from '../../data/matchesData';
import { MatchCard } from './MatchCard';
import { Search } from 'lucide-react';

interface MatchDiscoveryViewProps {
  onSelectMatch: (match: Match) => void;
  onViewDetails: (match: Match) => void;
}

export const MatchDiscoveryView: React.FC<MatchDiscoveryViewProps> = ({
  onSelectMatch,
  onViewDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');

  const formats = ['All', 'T20', 'ODI', 'Test'];

  const filteredMatches = useMemo(() => {
    return MATCHES_DATA.filter(match => {
      if (selectedFormat !== 'All' && match.format !== selectedFormat) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTeam = match.teamA.name.toLowerCase().includes(query) ||
                            match.teamB.name.toLowerCase().includes(query) ||
                            match.teamA.shortName.toLowerCase().includes(query) ||
                            match.teamB.shortName.toLowerCase().includes(query);
        const matchesVenue = match.venue.name.toLowerCase().includes(query) ||
                             match.venue.city.toLowerCase().includes(query);
        const matchesTitle = match.title.toLowerCase().includes(query);
        if (!matchesTeam && !matchesVenue && !matchesTitle) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price') {
        return a.minPrice - b.minPrice;
      }
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
  }, [searchQuery, selectedFormat, sortBy]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1500px] mx-auto font-mono select-none">
      <div className="mb-10 border-b border-[#292929] pb-6">
        <span className="text-xs uppercase tracking-widest text-[#E78260] font-bold block mb-2">
          SECTION 01 // TOURNAMENT DIRECTORY
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#292929] tracking-tight uppercase">
          INTERNATIONAL FIXTURE LEDGER
        </h1>
        <p className="text-xs text-[#292929]/70 mt-2 max-w-2xl uppercase tracking-wider leading-relaxed">
          Select any match to enter the signature interactive 3D stadium, preview seat perspectives with virtual pitch sightlines, and secure official digital passes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between border border-[#292929] p-4 bg-[#F3EFE6] shadow-[2px_2px_0px_#292929]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#292929]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team, stadium, or city..."
            className="w-full pl-9 pr-4 py-2 border border-[#292929] bg-[#F3EFE6] text-xs font-mono font-bold text-[#292929] placeholder-[#292929]/40 outline-none focus:border-[#E78260]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end text-xs">
          {/* Format pills */}
          <div className="flex border border-[#292929]">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 font-bold uppercase transition-all ${
                  selectedFormat === fmt
                    ? 'bg-[#292929] text-[#F3EFE6]'
                    : 'bg-[#F3EFE6] text-[#292929] hover:bg-[#292929]/10'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#292929]/60 uppercase">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
              className="border border-[#292929] bg-[#F3EFE6] text-[#292929] text-xs font-bold px-2 py-1 outline-none"
            >
              <option value="date">CHRONOLOGICAL</option>
              <option value="price">LOWEST PRICE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fixtures Grid */}
      {filteredMatches.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#292929]/40 text-xs text-[#292929]/60 uppercase">
          No matches found matching search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#292929]">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelectMatch={onSelectMatch}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
