import React from 'react';
import type { Seat, StandSection } from '../../types';

interface SeatSelectionGridProps {
  stand: StandSection;
  seats: Seat[];
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  maxSeatsAllowed?: number;
}

export const SeatSelectionGrid: React.FC<SeatSelectionGridProps> = ({
  stand,
  seats,
  selectedSeats,
  onToggleSeat,
  maxSeatsAllowed = 6
}) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatStatus = (seat: Seat) => {
    if (selectedSeats.some(s => s.id === seat.id)) return 'selected';
    return seat.status;
  };

  return (
    <div className="border border-[#292929] bg-[#F3EFE6] p-6 lg:p-8 select-none font-mono">
      {/* Pitch Orientation Marker at Top */}
      <div className="border border-[#292929] bg-[#292929] text-[#F3EFE6] py-2.5 px-4 text-center text-xs uppercase tracking-[0.25em] font-bold mb-8 flex items-center justify-center gap-3 shadow-[2px_2px_0px_#E78260]">
        <span className="text-[#E78260]">▲</span>
        <span>TO THE BOWLER&apos;S CREASE &amp; 22-YARD WICKET</span>
        <span className="text-[#E78260]">▲</span>
      </div>

      {/* Seat Legend (Strict 3-Color System) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-6 mb-8 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border border-[#292929] bg-[#F3EFE6] flex items-center justify-center text-[10px] font-bold text-[#292929]">
            01
          </div>
          <span className="text-[#292929] font-medium">AVAILABLE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#E78260] text-[#F3EFE6] flex items-center justify-center font-bold text-[10px]">
            02
          </div>
          <span className="text-[#E78260] font-bold">SELECTED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#292929] text-[#F3EFE6]/40 flex items-center justify-center text-[10px]">
            ✕
          </div>
          <span className="text-[#292929]/60">OCCUPIED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-[#E78260] bg-[#F3EFE6] text-[#E78260] flex items-center justify-center text-[10px] font-bold">
            ★
          </div>
          <span className="font-bold text-[#292929]">CLUB VIP (ROW A)</span>
        </div>
        <div className="text-right text-[11px] text-[#292929]/70 font-bold">
          SELECTED: <span className="text-[#E78260] font-black">{selectedSeats.length}</span> / {maxSeatsAllowed} MAX
        </div>
      </div>

      {/* Tactile Stepped Seat Matrix */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[640px] space-y-3">
          {rows.map((row) => {
            const rowSeats = seats.filter(s => s.row === row);
            const leftAisle = rowSeats.slice(0, 8);
            const rightAisle = rowSeats.slice(8, 16);

            return (
              <div key={`row-${row}`} className="flex items-center gap-3">
                {/* Row Letter */}
                <div className="w-6 text-center font-bold text-xs text-[#292929]/70">
                  {row}
                </div>

                {/* Left Aisle (Seats 1-8) */}
                <div className="flex-1 grid grid-cols-8 gap-1.5">
                  {leftAisle.map((seat) => {
                    const status = getSeatStatus(seat);
                    const isSelected = status === 'selected';
                    const isReserved = status === 'reserved';
                    const isVip = seat.row === 'A';

                    return (
                      <button
                        key={seat.id}
                        disabled={isReserved}
                        onClick={() => onToggleSeat(seat)}
                        title={`Row ${seat.row} Seat ${seat.number} · ₹${seat.price.toLocaleString()}`}
                        className={`h-9 border text-[11px] font-bold transition-all flex flex-col items-center justify-center relative active:scale-95 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-[#E78260] text-[#F3EFE6] border-[#292929] shadow-[1px_1px_0px_#292929] -translate-y-0.5'
                            : isReserved
                            ? 'bg-[#292929] text-[#F3EFE6]/30 border-[#292929]'
                            : isVip
                            ? 'bg-[#F3EFE6] text-[#292929] border-[#E78260] border-2 hover:bg-[#E78260]/10'
                            : 'bg-[#F3EFE6] text-[#292929] border-[#292929] hover:bg-[#292929] hover:text-[#F3EFE6]'
                        }`}
                      >
                        {isReserved ? (
                          '✕'
                        ) : (
                          <span>{seat.number.toString().padStart(2, '0')}</span>
                        )}
                        {isVip && !isReserved && !isSelected && (
                          <span className="absolute top-0.5 right-0.5 text-[8px] text-[#E78260] leading-none">★</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Central Amphitheater Aisle Division */}
                <div className="w-6 text-center text-[10px] text-[#292929]/40 font-bold uppercase tracking-tighter">
                  AISLE
                </div>

                {/* Right Aisle (Seats 9-16) */}
                <div className="flex-1 grid grid-cols-8 gap-1.5">
                  {rightAisle.map((seat) => {
                    const status = getSeatStatus(seat);
                    const isSelected = status === 'selected';
                    const isReserved = status === 'reserved';
                    const isVip = seat.row === 'A';

                    return (
                      <button
                        key={seat.id}
                        disabled={isReserved}
                        onClick={() => onToggleSeat(seat)}
                        title={`Row ${seat.row} Seat ${seat.number} · ₹${seat.price.toLocaleString()}`}
                        className={`h-9 border text-[11px] font-bold transition-all flex flex-col items-center justify-center relative active:scale-95 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-[#E78260] text-[#F3EFE6] border-[#292929] shadow-[1px_1px_0px_#292929] -translate-y-0.5'
                            : isReserved
                            ? 'bg-[#292929] text-[#F3EFE6]/30 border-[#292929]'
                            : isVip
                            ? 'bg-[#F3EFE6] text-[#292929] border-[#E78260] border-2 hover:bg-[#E78260]/10'
                            : 'bg-[#F3EFE6] text-[#292929] border-[#292929] hover:bg-[#292929] hover:text-[#F3EFE6]'
                        }`}
                      >
                        {isReserved ? (
                          '✕'
                        ) : (
                          <span>{seat.number.toString().padStart(2, '0')}</span>
                        )}
                        {isVip && !isReserved && !isSelected && (
                          <span className="absolute top-0.5 right-0.5 text-[8px] text-[#E78260] leading-none">★</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Matrix Notice */}
      <div className="mt-8 pt-4 border-t border-[#292929]/20 flex flex-wrap justify-between items-center text-xs text-[#292929]/70">
        <span>* CLICK ANY SEAT TO TOGGLE PASS REQUISITION (MAX 6 PASSES)</span>
        <span className="text-[#E78260] font-bold">
          ACTIVE SECTOR: {stand.name.toUpperCase()} (TIER: {stand.tier.toUpperCase()})
        </span>
      </div>
    </div>
  );
};
