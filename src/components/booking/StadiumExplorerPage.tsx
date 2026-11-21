import React, { useState } from 'react';
import type { Match, StandSection, Seat, FanAddon } from '../../types';
import { STADIUM_STANDS, generateStandSeats } from '../../data/stadiumConfig';
import { CricketStadiumCanvas } from '../stadium3d/CricketStadiumCanvas';
import { SeatSelectionGrid } from './SeatSelectionGrid';
import { FanAddonsSection } from './FanAddonsSection';
import { BookingSummaryDrawer } from './BookingSummaryDrawer';
import { CheckoutPaymentModal } from './CheckoutPaymentModal';
import { ArrowLeft, MapPin, Calendar, Layers } from 'lucide-react';

interface StadiumExplorerPageProps {
  match: Match;
  onBackToMatches: () => void;
  onBookingConfirmed: (match: Match, stand: StandSection, seats: Seat[], addons: { addon: FanAddon; quantity: number }[], bookingRef: string, turnstileCode: string) => void;
}

export const StadiumExplorerPage: React.FC<StadiumExplorerPageProps> = ({
  match,
  onBackToMatches,
  onBookingConfirmed
}) => {
  const [selectedStand, setSelectedStand] = useState<StandSection>(STADIUM_STANDS[0]);
  const [standSeats, setStandSeats] = useState<Seat[]>(() =>
    generateStandSeats(STADIUM_STANDS[0].id, STADIUM_STANDS[0].basePrice)
  );
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{ addon: FanAddon; quantity: number }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleSelectStand = (stand: StandSection) => {
    setSelectedStand(stand);
    setStandSeats(generateStandSeats(stand.id, stand.basePrice));
  };

  const handleToggleSeat = (seat: Seat) => {
    setSelectedSeats(prev => {
      const exists = prev.some(s => s.id === seat.id);
      if (exists) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        if (prev.length >= 6) {
          alert('Maximum 6 tickets can be selected per transaction.');
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const handleRemoveSeat = (seatId: string) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
  };

  const handleUpdateAddonQuantity = (addon: FanAddon, delta: number) => {
    setSelectedAddons(prev => {
      const existing = prev.find(item => item.addon.id === addon.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter(item => item.addon.id !== addon.id);
        }
        return prev.map(item => item.addon.id === addon.id ? { ...item, quantity: newQty } : item);
      } else if (delta > 0) {
        return [...prev, { addon, quantity: 1 }];
      }
      return prev;
    });
  };

  const handlePaymentSuccess = (bookingRef: string, turnstileCode: string) => {
    setIsCheckoutOpen(false);
    onBookingConfirmed(match, selectedStand, selectedSeats, selectedAddons, bookingRef, turnstileCode);
  };

  return (
    <div className="min-h-screen pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMatches}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Matches</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                {match.tournament} · {match.matchNumber}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {match.teamA.name} <span className="text-slate-400 font-normal">vs</span> {match.teamB.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span>{match.venue.name}, {match.venue.city}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{new Date(match.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Select Stand:</span>
          </div>
          {STADIUM_STANDS.map((stand) => {
            const isSelected = selectedStand.id === stand.id;
            return (
              <button
                key={stand.id}
                onClick={() => handleSelectStand(stand)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: stand.color }}
                />
                <span>{stand.name}</span>
                <span className="text-[10px] opacity-80 font-mono">
                  ₹{stand.basePrice.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-[480px] w-full">
            <CricketStadiumCanvas
              selectedStand={selectedStand}
              onSelectStand={handleSelectStand}
              seats={standSeats}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
            />
          </div>

          <SeatSelectionGrid
            stand={selectedStand}
            seats={standSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
          />

          <FanAddonsSection
            selectedAddons={selectedAddons}
            onUpdateAddonQuantity={handleUpdateAddonQuantity}
          />
        </div>

        <div className="lg:col-span-4 sticky top-6">
          <BookingSummaryDrawer
            match={match}
            stand={selectedStand}
            selectedSeats={selectedSeats}
            selectedAddons={selectedAddons}
            onRemoveSeat={handleRemoveSeat}
            onProceedToPayment={() => setIsCheckoutOpen(true)}
          />
        </div>
      </div>

      {isCheckoutOpen && <CheckoutPaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        match={match}
        stand={selectedStand}
        selectedSeats={selectedSeats}
        selectedAddons={selectedAddons}
        onPaymentSuccess={handlePaymentSuccess}
      />}
    </div>
  );
};
