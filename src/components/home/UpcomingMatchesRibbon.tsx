import React from 'react';
import type { Match } from '../../types';
import { MATCHES_DATA } from '../../data/matchesData';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

interface UpcomingMatchesRibbonProps {
  onSelectMatch: (match: Match) => void;
  onViewDetails: (match: Match) => void;
  onViewAllMatches: () => void;
}

const secondaryFixtures = MATCHES_DATA
  .filter((match) => match.id !== MATCHES_DATA[0].id && match.matchStatus === 'Upcoming')
  .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

const fixtureDate = (value: string) => new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short'
}).format(new Date(value));

export const UpcomingMatchesRibbon: React.FC<UpcomingMatchesRibbonProps> = ({
  onSelectMatch,
  onViewDetails,
  onViewAllMatches
}) => (
  <section id="fixtures" className="cp-fixtures-section" aria-labelledby="fixtures-title">
    <div className="cp-fixtures-heading">
      <div>
        <p className="cp-section-kicker">02 / The calendar</p>
        <h2 id="fixtures-title">More cricket, on the horizon.</h2>
      </div>
      <button className="cp-text-link" type="button" onClick={onViewAllMatches}>
        All fixtures <ArrowRight size={15} aria-hidden="true" />
      </button>
    </div>

    <ol className="cp-fixture-list">
      {secondaryFixtures.map((match, index) => (
        <li className="cp-fixture-row" key={match.id}>
          <span className="cp-fixture-index">{String(index + 2).padStart(2, '0')}</span>
          <div className="cp-fixture-date">
            <strong>{fixtureDate(match.dateTime)}</strong>
            <span>{match.format}</span>
          </div>
          <div className="cp-fixture-match">
            <span>{match.tournament} · {match.matchNumber}</span>
            <strong>{match.teamA.name} <i>v</i> {match.teamB.name}</strong>
          </div>
          <div className="cp-fixture-venue">
            <MapPin size={14} aria-hidden="true" />
            <span>{match.venue.name}<small>{match.venue.city}</small></span>
          </div>
          <div className="cp-fixture-price">
            <span>From</span>
            <strong>₹{match.minPrice.toLocaleString('en-IN')}</strong>
          </div>
          <div className="cp-fixture-actions">
            <button className="cp-fixture-detail" type="button" onClick={() => onViewDetails(match)}>
              Details
            </button>
            <button className="cp-fixture-book" type="button" onClick={() => onSelectMatch(match)} disabled={match.ticketStatus === 'Sold Out'}>
              View seats <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </li>
      ))}
    </ol>
    <p className="cp-fixtures-footnote"><CalendarDays size={14} aria-hidden="true" /> Dates and availability follow the fixture listing.</p>
  </section>
);
