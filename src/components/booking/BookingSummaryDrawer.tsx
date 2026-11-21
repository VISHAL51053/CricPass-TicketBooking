import React, { useState, useEffect } from 'react';
import type { Match, StandSection, Seat, FanAddon } from '../../types';
import { Trash2 } from 'lucide-react';

interface BookingSummaryDrawerProps {
  match: Match;
  stand: StandSection;
  selectedSeats: Seat[];
  selectedAddons: { addon: FanAddon; quantity: number }[];
  onRemoveSeat: (seatId: string) => void;
  onProceedToPayment: () => void;
  onToggleAddon?: (addonId: string) => void;
}

export const BookingSummaryDrawer: React.FC<BookingSummaryDrawerProps> = ({
  match,
  stand,
  selectedSeats,
  selectedAddons,
  onRemoveSeat,
  onProceedToPayment,
  onToggleAddon
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(600);

  useEffect(() => {
    if (selectedSeats.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeats.length]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const seatsSubtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const addonsSubtotal = selectedAddons.reduce((acc, item) => acc + item.addon.price * item.quantity, 0);
  const subtotal = seatsSubtotal + addonsSubtotal;
  const facilityFee = selectedSeats.length > 0 ? 150 : 0;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + facilityFee + gst;

  const isJerseySelected = selectedAddons.some(a => a.addon.id === 'jersey' && a.quantity > 0);
  const isFnbSelected = selectedAddons.some(a => a.addon.id === 'hospitality' && a.quantity > 0);
  const isParkingSelected = selectedAddons.some(a => a.addon.id === 'parking' && a.quantity > 0);

  return (
    <div className="border border-[#292929] bg-[#F3EFE6] p-6 lg:p-8 font-mono select-none shadow-[4px_4px_0px_#292929]">
      {/* Ledger Header */}
      <div className="flex items-center justify-between border-b border-[#292929] pb-4 mb-6">
        <div>
          <span className="text-[10px] uppercase text-[#292929]/60 block font-semibold">
            REQUISITION LEDGER
          </span>
          <h3 className="font-serif text-2xl font-black tracking-tight uppercase text-[#292929]">
            TICKET DOSSIER
          </h3>
        </div>

        {/* 10-Minute Lock Badge */}
        <div className="border border-[#E78260] bg-[#E78260]/10 px-2.5 py-1 text-right">
          <span className="text-[9px] block text-[#E78260] font-bold uppercase">
            SEAT LOCK
          </span>
          <span className="text-xs font-bold text-[#E78260]">
            {formatTimer(timeLeft)}
          </span>
        </div>
      </div>

      {/* Match & Sector Dossier Header */}
      <div className="mb-5 p-3 border border-[#292929]/20 bg-[#292929]/5 text-xs">
        <div className="font-bold text-[#292929] truncate">
          {match.teamA.shortName} vs {match.teamB.shortName} · {match.matchNumber}
        </div>
        <div className="text-[#292929]/70 text-[11px] mt-0.5">
          {stand.name} ({stand.tier})
        </div>
      </div>

      {/* Selected Seats List */}
      <div className="mb-6 text-xs">
        <div className="flex justify-between text-[#292929]/60 border-b border-[#292929]/20 pb-2 mb-3 text-[10px] uppercase font-semibold">
          <span>SEAT POSITION</span>
          <span>TIER VALUATION</span>
        </div>

        {selectedSeats.length === 0 ? (
          <div className="p-4 border border-dashed border-[#292929]/30 text-center text-[11px] text-[#292929]/60">
            No passes chosen. Click seats in 3D Arena or Seating Vault.
          </div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between p-2 border border-[#292929] bg-[#F3EFE6]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E78260]" />
                  <span className="font-bold text-[#292929]">
                    Row {seat.row} · Seat {seat.number.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#E78260]">
                    ₹{seat.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onRemoveSeat(seat.id)}
                    className="text-[#292929]/50 hover:text-[#E78260] transition-colors p-0.5"
                    title="Remove pass"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fan Experience Add-ons Section */}
      <div className="border-t border-b border-[#292929] py-5 my-6">
        <span className="text-xs font-bold uppercase tracking-wider block mb-3 text-[#292929]">
          FAN EXPERIENCE ACCREDITATION:
        </span>

        <div className="space-y-3 text-xs">
          {/* Add-on 1 */}
          <label className="flex items-start justify-between gap-3 p-2.5 border border-[#292929]/30 hover:border-[#292929] cursor-pointer bg-[#F3EFE6]">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={isJerseySelected}
                onChange={() => onToggleAddon && onToggleAddon('jersey')}
                className="mt-0.5 accent-[#E78260]"
              />
              <div>
                <span className="font-bold block text-[#292929]">Tournament Match Jersey</span>
                <span className="text-[10px] text-[#292929]/60">Official Commemorative Edition</span>
              </div>
            </div>
            <span className="font-bold text-[#E78260] whitespace-nowrap">+₹2,499</span>
          </label>

          {/* Add-on 2 */}
          <label className="flex items-start justify-between gap-3 p-2.5 border border-[#292929]/30 hover:border-[#292929] cursor-pointer bg-[#F3EFE6]">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={isFnbSelected}
                onChange={() => onToggleAddon && onToggleAddon('hospitality')}
                className="mt-0.5 accent-[#E78260]"
              />
              <div>
                <span className="font-bold block text-[#292929]">Match Day F&amp;B Pass</span>
                <span className="text-[10px] text-[#292929]/60">Unlimited Pavilion Hospitality</span>
              </div>
            </div>
            <span className="font-bold text-[#E78260] whitespace-nowrap">+₹899</span>
          </label>

          {/* Add-on 3 */}
          <label className="flex items-start justify-between gap-3 p-2.5 border border-[#292929]/30 hover:border-[#292929] cursor-pointer bg-[#F3EFE6]">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={isParkingSelected}
                onChange={() => onToggleAddon && onToggleAddon('parking')}
                className="mt-0.5 accent-[#E78260]"
              />
              <div>
                <span className="font-bold block text-[#292929]">VIP Underground Parking</span>
                <span className="text-[10px] text-[#292929]/60">Dedicated Gate 04 Valet</span>
              </div>
            </div>
            <span className="font-bold text-[#E78260] whitespace-nowrap">+₹500</span>
          </label>
        </div>
      </div>

      {/* Itemized Financial Summary */}
      <div className="space-y-2.5 text-xs border-b border-[#292929] pb-5 mb-6">
        <div className="flex justify-between">
          <span className="text-[#292929]/70">TICKETS SUBTOTAL</span>
          <span className="font-bold text-[#292929]">₹{seatsSubtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#292929]/70">EXPERIENCE ADD-ONS</span>
          <span className="font-bold text-[#292929]">₹{addonsSubtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#292929]/70">ARCHITECTURAL FACILITY FEE</span>
          <span className="font-bold text-[#292929]">₹{facilityFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#292929]/70">GOVERNMENT GST (18%)</span>
          <span className="font-bold text-[#292929]">₹{gst.toLocaleString()}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-[#292929]/20 font-bold text-sm text-[#292929]">
          <span>TOTAL REQUISITION</span>
          <span className="text-xl text-[#E78260] font-black font-mono">
            ₹{grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Primary Checkout Button */}
      <button
        disabled={selectedSeats.length === 0}
        onClick={onProceedToPayment}
        className="w-full bg-[#E78260] hover:bg-[#E78260]/90 text-[#F3EFE6] font-mono text-xs sm:text-sm uppercase tracking-widest font-black py-4 px-4 border border-[#292929] transition-transform active:translate-y-0.5 shadow-[2px_2px_0px_#292929] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        CONFIRM SEATS &amp; PROCEED TO CHECKOUT
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#292929]/60 uppercase">
        <span>● ENCRYPTED LEDGER</span>
        <span>·</span>
        <span>NON-TRANSFERABLE PASS</span>
      </div>
    </div>
  );
};
