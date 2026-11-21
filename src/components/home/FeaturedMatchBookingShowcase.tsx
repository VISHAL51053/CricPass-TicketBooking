import React, { useState } from 'react';
import type { Match, StandSection } from '../../types';
import { STADIUM_STANDS } from '../../data/stadiumConfig';
import { ArrowRight, MapPin, Ticket } from 'lucide-react';

interface FeaturedMatchBookingShowcaseProps {
  match: Match;
  onBookTickets: (match: Match, stand: StandSection) => void;
  onExploreStadium: (match: Match, stand: StandSection) => void;
}

const standLabel: Record<string, string> = {
  'pavilion-terrace': 'Presidential Pavilion',
  'north-stand': 'North Grandstand',
  'south-stand': 'South Grandstand',
  'east-stand': 'East Mid-Wicket Stand',
  'west-stand': 'West Square Leg Stand',
  'general-upper': 'Upper Deck',
  'corporate-suites': 'Premium Hospitality'
};

const standOrder = ['pavilion-terrace', 'north-stand', 'south-stand', 'east-stand', 'west-stand', 'general-upper', 'corporate-suites'];
const ticketableStands = [...STADIUM_STANDS].sort((left, right) =>
  standOrder.indexOf(left.id) - standOrder.indexOf(right.id)
);

export const FeaturedMatchBookingShowcase: React.FC<FeaturedMatchBookingShowcaseProps> = ({
  match,
  onBookTickets,
  onExploreStadium
}) => {
  const [selectedStandId, setSelectedStandId] = useState('general-upper');
  const selectedStand = ticketableStands.find((stand) => stand.id === selectedStandId) ?? ticketableStands[0];
  const date = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(match.dateTime));
  const time = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(match.dateTime));

  return (
    <section id="match-booking" className="cp-feature-section" aria-labelledby="featured-match-title">
      <div className="cp-section-heading">
        <p className="cp-section-kicker">01 / The fixture</p>
        <h2 id="featured-match-title">Choose your side of the story.</h2>
        <p>Start with the match, then pick a stand and inspect the view from your seat.</p>
      </div>

      <div className="cp-match-feature">
        <div className="cp-match-dossier">
          <div className="cp-match-meta">
            <span>{match.tournament}</span>
            <span className="cp-meta-dot" aria-hidden="true" />
            <span>{match.matchNumber} · {match.format}</span>
          </div>

          <div className="cp-team-lineup" aria-label={`${match.teamA.name} versus ${match.teamB.name}`}>
            <div className="cp-team">
              <span className="cp-team-mark" style={{ '--team-mark': match.teamA.primaryColor } as React.CSSProperties}>
                {match.teamA.shortName}
              </span>
              <div>
                <span className="cp-team-country">{match.teamA.country}</span>
                <strong>{match.teamA.name}</strong>
              </div>
            </div>
            <span className="cp-versus">v</span>
            <div className="cp-team cp-team-away">
              <div>
                <span className="cp-team-country">{match.teamB.country}</span>
                <strong>{match.teamB.name}</strong>
              </div>
              <span className="cp-team-mark" style={{ '--team-mark': match.teamB.primaryColor } as React.CSSProperties}>
                {match.teamB.shortName}
              </span>
            </div>
          </div>

          <div className="cp-match-details">
            <div>
              <span className="cp-detail-label">Date &amp; time</span>
              <strong>{date}</strong>
              <span>{time}</span>
            </div>
            <div>
              <span className="cp-detail-label">Venue</span>
              <strong>{match.venue.name}</strong>
              <span className="cp-venue-city"><MapPin size={13} aria-hidden="true" />{match.venue.city}, {match.venue.country}</span>
            </div>
          </div>
        </div>

        <div className="cp-stand-picker">
          <div className="cp-picker-head">
            <div>
              <span className="cp-detail-label">Find your section</span>
              <h3>Stands &amp; starting prices</h3>
            </div>
            <span className="cp-availability">{match.ticketStatus}</span>
          </div>

          <div className="cp-stand-list" role="group" aria-label="Choose a stadium stand">
            {ticketableStands.map((stand) => {
              const selected = stand.id === selectedStand.id;
              return (
                <button
                  className={`cp-stand-choice${selected ? ' is-selected' : ''}`}
                  key={stand.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedStandId(stand.id)}
                >
                  <span className="cp-stand-name">{standLabel[stand.id] ?? stand.name}</span>
                  <span className="cp-stand-inventory">{stand.availableSeats.toLocaleString('en-IN')} left</span>
                  <strong>₹{stand.basePrice.toLocaleString('en-IN')}</strong>
                </button>
              );
            })}
          </div>

          <div className="cp-picked-stand">
            <div>
              <span className="cp-detail-label">Selected section</span>
              <strong>{standLabel[selectedStand.id] ?? selectedStand.name}</strong>
              <span>From ₹{selectedStand.basePrice.toLocaleString('en-IN')} · {selectedStand.availableSeats.toLocaleString('en-IN')} shown available</span>
            </div>
            <div className="cp-picked-actions">
              <button className="cp-button cp-button-outline" type="button" onClick={() => onExploreStadium(match, selectedStand)}>
                Inspect in 3D <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button className="cp-button cp-button-primary" type="button" onClick={() => onBookTickets(match, selectedStand)}>
                <Ticket size={15} aria-hidden="true" /> Choose a seat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
