import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Match, StandSection, Seat, FanAddon } from '../../types';
import { calculateBookingTotals } from '../../data/bookingTotals';
import { ArrowLeft, Calendar, Check, MapPin, Printer, QrCode } from 'lucide-react';

interface BookingSuccessTicketProps {
  match: Match;
  stand: StandSection;
  selectedSeats: Seat[];
  selectedAddons: { addon: FanAddon; quantity: number }[];
  bookingReference: string;
  turnstileCode: string;
  onReturnHome: () => void;
}

const price = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const BookingSuccessTicket: React.FC<BookingSuccessTicketProps> = ({
  match,
  stand,
  selectedSeats,
  selectedAddons,
  bookingReference,
  turnstileCode,
  onReturnHome
}) => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({ particleCount: 38, spread: 54, startVelocity: 24, origin: { y: 0.72 }, colors: ['#E78260', '#292929', '#F3EFE6'] });
  }, []);

  const totals = calculateBookingTotals(selectedSeats, selectedAddons);
  const matchDate = new Date(match.dateTime);

  return (
    <main className="cp-confirmation">
      <div className="cp-confirmation__intro">
        <span className="cp-confirmation__mark"><Check size={24} /></span>
        <p className="cp-stadium__eyebrow">Local preview · no payment made</p>
        <h1>Your booking preview is ready.</h1>
        <p>This is a temporary demo record for the current page session. It is not a valid ticket or entry pass.</p>
      </div>

      <section className="cp-confirmation__ticket" aria-label="Demo booking preview">
        <header className="cp-confirmation__ticket-head">
          <div><span>CRICPASS · MATCH PREVIEW</span><h2>{match.teamA.shortName} <i>v</i> {match.teamB.shortName}</h2><small>{match.title}</small></div>
          <div className="cp-confirmation__reference"><small>Local reference</small><b>{bookingReference}</b></div>
        </header>

        <div className="cp-confirmation__details">
          <div><span><Calendar size={14} /> Match date</span><b>{matchDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</b><small>{matchDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</small></div>
          <div><span><MapPin size={14} /> Venue</span><b>{match.venue.name}</b><small>{match.venue.city}</small></div>
          <div><span>Stand</span><b>{stand.name}</b><small>{stand.tier}</small></div>
          <div><span>Seats</span><b>{selectedSeats.map((seat) => `${seat.row}${String(seat.number).padStart(2, '0')}`).join(' · ')}</b><small>{selectedSeats.length} selected</small></div>
        </div>

        {selectedAddons.length > 0 && <div className="cp-confirmation__addons"><span>Matchday extras</span>{selectedAddons.map(({ addon, quantity }) => <div key={addon.id}><b>{addon.name}</b><span>{quantity} × {price(addon.price)}</span></div>)}</div>}

        <div className="cp-confirmation__payment">
          <div className="cp-confirmation__preview-qr"><QrCode size={52} /><span>Preview only<br />not scannable</span></div>
          <div className="cp-confirmation__not-ticket"><b>Not a venue ticket</b><span>No real reservation, payment, QR code or gate access was created.</span><small>Suggested section label: {turnstileCode}</small></div>
          <div className="cp-confirmation__amount"><small>Estimated total</small><strong>{price(totals.total)}</strong><span>Includes ₹{totals.facilityFee.toLocaleString('en-IN')} fee and {price(totals.gst)} GST</span></div>
        </div>
      </section>

      <div className="cp-confirmation__actions">
        <button type="button" onClick={() => window.print()}><Printer size={15} /> Print preview</button>
        <button type="button" className="is-secondary" onClick={onReturnHome}><ArrowLeft size={15} /> Return to CRICPASS</button>
      </div>
    </main>
  );
};
