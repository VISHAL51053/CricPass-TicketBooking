import React, { useState } from 'react';
import type { UserTicket } from '../../types';
import { calculateBookingTotals } from '../../data/bookingTotals';
import { CalendarDays, Mail, Printer, Ticket, UserRound, X } from 'lucide-react';
import { useModalFocus } from '../../hooks/useModalFocus';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTickets: UserTicket[];
  userName?: string;
  userEmail?: string;
}

const price = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  userTickets,
  userName = '',
  userEmail = ''
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('tickets');
  const dialogRef = useModalFocus(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="cp-checkout-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} className="cp-account-modal cp-account-modal--wide" role="dialog" aria-modal="true" aria-labelledby="cp-profile-title">
        <header><div><span className="cp-stadium__eyebrow">CRICPASS · page session</span><h2 id="cp-profile-title">Matchday account</h2></div><button type="button" onClick={onClose} aria-label="Close account"><X size={18} /></button></header>
        <nav className="cp-account-modal__tabs" aria-label="Account sections">
          <button type="button" className={activeTab === 'tickets' ? 'is-active' : ''} onClick={() => setActiveTab('tickets')}><Ticket size={15} /> Booking previews <span>{userTickets.length}</span></button>
          <button type="button" className={activeTab === 'profile' ? 'is-active' : ''} onClick={() => setActiveTab('profile')}><UserRound size={15} /> Profile</button>
        </nav>

        <div className="cp-account-modal__body">
          {activeTab === 'profile' ? <div className="cp-profile-preview">
            <span className="cp-account-modal__icon"><UserRound size={23} /></span>
            <h3>{userName || 'Fan profile'}</h3>
            <p>This profile is held in this page session only.</p>
            <div><Mail size={15} /><span>{userEmail || 'No email added'}</span></div>
            <small>CRICPASS does not have a connected login or membership service in this demo.</small>
          </div> : userTickets.length === 0 ? <div className="cp-account-empty">
            <Ticket size={26} /><h3>No booking previews yet</h3><p>Choose a match and seats to create a local preview.</p>
          </div> : <div className="cp-account-ticket-list">
            {userTickets.map((ticket) => {
              const totals = calculateBookingTotals(ticket.seats, ticket.addons);
              return <article className="cp-account-ticket" key={ticket.bookingReference}>
                <div className="cp-account-ticket__top"><span>DEMO BOOKING · {ticket.bookingReference}</span><CalendarDays size={16} /></div>
                <h3>{ticket.match.teamA.shortName} <i>v</i> {ticket.match.teamB.shortName}</h3>
                <p>{ticket.match.title} · {new Date(ticket.match.dateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <div className="cp-account-ticket__details"><span>{ticket.stand.name}</span><b>{ticket.seats.map((seat) => `${seat.row}${String(seat.number).padStart(2, '0')}`).join(' · ')}</b><strong>{price(totals.total)}</strong></div>
                <div className="cp-account-ticket__note">Preview only · no payment or venue entry is confirmed.</div>
                <button type="button" onClick={() => window.print()}><Printer size={14} /> Print preview</button>
              </article>;
            })}
          </div>}
        </div>
      </section>
    </div>
  );
};
