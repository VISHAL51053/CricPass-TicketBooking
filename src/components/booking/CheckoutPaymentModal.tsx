import React, { useEffect, useRef, useState } from 'react';
import type { FanAddon, Match, Seat, StandSection } from '../../types';
import { calculateBookingTotals } from '../../data/bookingTotals';
import { Check, CreditCard, Smartphone, Landmark, X } from 'lucide-react';
import { useModalFocus } from '../../hooks/useModalFocus';

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  stand: StandSection | null;
  selectedSeats: Seat[];
  selectedAddons: { addon: FanAddon; quantity: number }[];
  onPaymentSuccess: (bookingRef: string, turnstileCode: string) => void;
}

type PreviewMethod = 'upi' | 'card' | 'bank';
const price = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  isOpen,
  onClose,
  match,
  stand,
  selectedSeats,
  selectedAddons,
  onPaymentSuccess
}) => {
  const [method, setMethod] = useState<PreviewMethod>('upi');
  const [isCreatingPreview, setIsCreatingPreview] = useState(false);
  const [status, setStatus] = useState('');
  const timer = useRef<number | null>(null);
  const totals = calculateBookingTotals(selectedSeats, selectedAddons);
  const dialogRef = useModalFocus(isOpen, onClose, !isCreatingPreview);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  if (!isOpen || !stand) return null;

  const handleCreatePreview = () => {
    if (isCreatingPreview || selectedSeats.length === 0) return;
    setIsCreatingPreview(true);
    setStatus('Preparing your local ticket preview…');
    timer.current = window.setTimeout(() => {
      timer.current = null;
      const reference = `PREVIEW-${Date.now().toString(36).slice(-6).toUpperCase()}`;
      const gate = `SUGGESTED-${stand.id.slice(0, 4).toUpperCase()}`;
      onPaymentSuccess(reference, gate);
    }, 450);
  };

  const methods: { id: PreviewMethod; label: string; detail: string; Icon: typeof Smartphone }[] = [
    { id: 'upi', label: 'UPI', detail: 'Preview selection', Icon: Smartphone },
    { id: 'card', label: 'Card', detail: 'Preview selection', Icon: CreditCard },
    { id: 'bank', label: 'Bank', detail: 'Preview selection', Icon: Landmark }
  ];

  return (
    <div className="cp-checkout-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget && !isCreatingPreview) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} className="cp-checkout" role="dialog" aria-modal="true" aria-labelledby="cp-checkout-title" aria-describedby="cp-checkout-note">
        <header className="cp-checkout__header">
          <div><span className="cp-stadium__eyebrow">CRICPASS · booking preview</span><h2 id="cp-checkout-title">Review your seats</h2></div>
          <button type="button" onClick={onClose} disabled={isCreatingPreview} aria-label="Close checkout"><X size={18} /></button>
        </header>

        <div className="cp-checkout__body">
          <div className="cp-checkout__fixture">
            <div><span className="cp-checkout__kicker">{match.tournament} · {match.matchNumber}</span><strong>{match.teamA.shortName} <i>v</i> {match.teamB.shortName}</strong><small>{match.title}</small></div>
            <div className="cp-checkout__seat-info"><b>{stand.name}</b><span>{selectedSeats.map((seat) => `${seat.row}${String(seat.number).padStart(2, '0')}`).join(' · ')}</span></div>
          </div>

          <div className="cp-checkout__methods" role="group" aria-label="Demo payment method preference">
            <div className="cp-checkout__section-heading"><span>Payment preference</span><small>Preview only</small></div>
            <div className="cp-checkout__method-list">
              {methods.map(({ id, label, detail, Icon }) => <button type="button" key={id} aria-pressed={method === id} className={method === id ? 'is-selected' : ''} onClick={() => setMethod(id)}>
                <Icon size={16} /><span><b>{label}</b><small>{detail}</small></span>{method === id && <Check size={15} />}
              </button>)}
            </div>
            <p id="cp-checkout-note">This project has no payment provider connected. No payment details are requested and no charge will be made.</p>
          </div>

          <div className="cp-checkout__totals" aria-label="Booking estimate">
            <div><span>Seats</span><b>{price(totals.seatsSubtotal)}</b></div>
            {totals.addonsSubtotal > 0 && <div><span>Matchday extras</span><b>{price(totals.addonsSubtotal)}</b></div>}
            <div><span>Facility fee</span><b>{price(totals.facilityFee)}</b></div>
            <div><span>GST · 18%</span><b>{price(totals.gst)}</b></div>
            <div className="cp-checkout__grand-total"><span>Estimated total</span><b>{price(totals.total)}</b></div>
          </div>

          {isCreatingPreview && <p className="cp-checkout__status" role="status">{status}</p>}
          <button className="cp-checkout__confirm" type="button" disabled={isCreatingPreview || selectedSeats.length === 0} onClick={handleCreatePreview}>
            {isCreatingPreview ? 'Preparing preview…' : <>Create demo booking <span>{price(totals.total)}</span></>}
          </button>
          <p className="cp-checkout__footnote">Creates a temporary booking preview in this page session. It is not a valid venue ticket.</p>
        </div>
      </section>
    </div>
  );
};
