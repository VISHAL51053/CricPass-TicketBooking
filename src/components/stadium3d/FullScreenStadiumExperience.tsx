import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { FanAddon, Match, Seat, StandSection, TimeOfDay } from '../../types';
import type { CameraPerspective } from './CameraController';
import { CricketStadiumScene } from './CricketStadiumScene';
import { calculateSeatSightline, FAN_ADDONS, generateStandSeats, STADIUM_STANDS } from '../../data/stadiumConfig';
import { calculateBookingTotals } from '../../data/bookingTotals';
import { Check, ChevronDown, CircleHelp, Eye, Minus, Plus, RotateCcw, Ticket, X } from 'lucide-react';

interface FullScreenStadiumExperienceProps {
  match: Match;
  initialStand?: StandSection;
  onReturnToHome: () => void;
  onProceedToCheckout: (
    match: Match,
    stand: StandSection,
    seats: Seat[],
    addons: { addon: FanAddon; quantity: number }[]
  ) => void;
}

const price = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
const STAND_SELECTION_ORDER = ['pavilion-terrace', 'north-stand', 'south-stand', 'east-stand', 'west-stand', 'general-upper', 'corporate-suites'];
const DISPLAY_STANDS = [...STADIUM_STANDS].sort((left, right) =>
  STAND_SELECTION_ORDER.indexOf(left.id) - STAND_SELECTION_ORDER.indexOf(right.id)
);

export const FullScreenStadiumExperience: React.FC<FullScreenStadiumExperienceProps> = ({
  match,
  initialStand,
  onReturnToHome,
  onProceedToCheckout
}) => {
  const [selectedStand, setSelectedStand] = useState<StandSection | null>(initialStand ?? null);
  const [standSeats, setStandSeats] = useState<Seat[]>(() =>
    initialStand ? generateStandSeats(initialStand.id, initialStand.basePrice) : []
  );
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seatLimitReached, setSeatLimitReached] = useState(false);
  const [activeViewingSeat, setActiveViewingSeat] = useState<Seat | null>(null);
  const [hoveredStand, setHoveredStand] = useState<StandSection | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('golden-hour');
  const [viewMode, setViewMode] = useState<CameraPerspective>(initialStand ? 'stand' : 'overview');
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isAddonListOpen, setIsAddonListOpen] = useState(false);
  const [isStandListOpen, setIsStandListOpen] = useState(!initialStand);
  const [isSeatPickerOpen, setIsSeatPickerOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<{ addon: FanAddon; quantity: number }[]>([]);

  const totals = useMemo(() => calculateBookingTotals(selectedSeats, selectedAddons), [selectedSeats, selectedAddons]);
  const currentSightline = selectedStand && activeViewingSeat
    ? calculateSeatSightline(selectedStand.id, activeViewingSeat.row, activeViewingSeat.number)
    : null;

  const handleSelectStand = useCallback((stand: StandSection) => {
    setSelectedStand(stand);
    setStandSeats(generateStandSeats(stand.id, stand.basePrice));
    setSelectedSeats([]);
    setSeatLimitReached(false);
    setActiveViewingSeat(null);
    setHoveredSeat(null);
    setViewMode('stand');
    setIsAutoRotate(false);
    setIsStandListOpen(false);
    setIsSeatPickerOpen(true);
  }, []);

  const handleToggleSeat = useCallback((seat: Seat) => {
    if (seat.status === 'reserved') return;
    const alreadySelected = selectedSeats.some((item) => item.id === seat.id);
    if (alreadySelected) setSelectedSeats((previous) => previous.filter((item) => item.id !== seat.id));
    else if (selectedSeats.length >= 6) {
      setSeatLimitReached(true);
      return;
    } else setSelectedSeats((previous) => [...previous, seat]);
    setSeatLimitReached(false);
    setActiveViewingSeat(seat);
    setHoveredSeat(null);
    setViewMode('seat-pov');
    setIsAutoRotate(false);
    setIsSeatPickerOpen(false);
  }, [selectedSeats]);

  const handleToggleAddon = (addon: FanAddon) => {
    setSelectedAddons((previous) => {
      const existing = previous.find((item) => item.addon.id === addon.id);
      return existing
        ? previous.filter((item) => item.addon.id !== addon.id)
        : [...previous, { addon, quantity: Math.max(1, selectedSeats.length) }];
    });
  };

  const handleAddonQuantity = (addonId: string, change: number) => {
    setSelectedAddons((previous) => previous.flatMap((item) => {
      if (item.addon.id !== addonId) return [item];
      const quantity = Math.min(6, item.quantity + change);
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const handleReturnToOverview = useCallback(() => {
    setViewMode('overview');
    setIsAutoRotate(false);
    setActiveViewingSeat(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isAddonListOpen) setIsAddonListOpen(false);
      else if (viewMode === 'seat-pov' || viewMode === 'stand') handleReturnToOverview();
      else onReturnToHome();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleReturnToOverview, isAddonListOpen, onReturnToHome, viewMode]);

  const selectedIds = useMemo(() => new Set(selectedSeats.map((seat) => seat.id)), [selectedSeats]);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <main className="cp-stadium" aria-label="Interactive stadium seat selection">
      <div className="cp-stadium__scene" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, powerPreference: 'high-performance' }}
          camera={{ position: [0, 72, 98], fov: 40, near: 0.15, far: 600 }}
        >
          <CricketStadiumScene
            selectedStand={selectedStand}
            onSelectStand={handleSelectStand}
            hoveredStand={hoveredStand}
            onHoverStand={setHoveredStand}
            seats={standSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            hoveredSeat={hoveredSeat}
            onHoverSeat={setHoveredSeat}
            timeOfDay={timeOfDay}
            viewMode={viewMode}
            isAutoRotate={isAutoRotate}
            selectedSeat={activeViewingSeat}
            isBallTrajectoryActive={false}
          />
        </Canvas>
      </div>

      <header className="cp-stadium__topbar">
        <button className="cp-stadium__back" type="button" onClick={onReturnToHome} aria-label="Exit stadium and return to CRICPASS" title="Exit stadium">
          <X size={15} /><span>Exit</span>
        </button>
        <div className="cp-stadium__match">
          <span className="cp-stadium__eyebrow">{match.tournament} · {match.matchNumber}</span>
          <strong>{match.teamA.shortName} <span>v</span> {match.teamB.shortName}</strong>
          <span>{match.venue.name} · {new Date(match.dateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
        <label className="cp-stadium__light">
          <span>Light</span>
          <select value={timeOfDay} onChange={(event) => setTimeOfDay(event.target.value as TimeOfDay)} aria-label="Stadium lighting">
            <option value="day">Day</option><option value="golden-hour">Golden hour</option><option value="sunset">Sunset</option><option value="night">Night</option>
          </select>
        </label>
      </header>

      {(!selectedStand || isStandListOpen) && <aside className="cp-stadium__stands" aria-label="Choose a stand">
        <div className="cp-stadium__panel-heading">
          <span className="cp-stadium__eyebrow">The ground</span>
          <h1>Choose your view</h1>
          <p>Select a section in the scene or browse the stands.</p>
        </div>
        <div className="cp-stadium__stand-list">
          {DISPLAY_STANDS.map((stand, index) => {
            const isSelected = selectedStand?.id === stand.id;
            const isHovered = hoveredStand?.id === stand.id;
            return (
              <button
                key={stand.id}
                type="button"
                className={`cp-stadium__stand${isSelected ? ' is-selected' : ''}${isHovered ? ' is-hovered' : ''}`}
                aria-pressed={isSelected}
                onPointerEnter={() => setHoveredStand(stand)}
                onPointerLeave={() => setHoveredStand(null)}
                onFocus={() => setHoveredStand(stand)}
                onBlur={() => setHoveredStand(null)}
                onClick={() => handleSelectStand(stand)}
              >
                <span className="cp-stadium__stand-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="cp-stadium__stand-copy"><strong>{stand.name}</strong><small>{stand.availableSeats.toLocaleString('en-IN')} seats available</small></span>
                <span className="cp-stadium__stand-price">{price(stand.basePrice)}<small>from</small></span>
              </button>
            );
          })}
        </div>
        <div className="cp-stadium__hint"><CircleHelp size={15} /><span>Drag to orbit · scroll to zoom</span></div>
        <p className="cp-stadium__inventory-note">Availability shown is sample inventory for this preview.</p>
      </aside>}

      {selectedStand && !isStandListOpen && (
        <button
          type="button"
          className="cp-stadium__stand-toggle"
          aria-expanded={isStandListOpen}
          onClick={() => setIsStandListOpen(true)}
        >
          <ChevronDown size={14} /> Change stand
        </button>
      )}

      {hoveredStand && hoveredStand.id !== selectedStand?.id && (
        <div className="cp-stadium__hover-label" role="status">
          <strong>{hoveredStand.name}</strong><span>{price(hoveredStand.basePrice)} · {hoveredStand.availableSeats.toLocaleString('en-IN')} available</span>
        </div>
      )}

      {selectedStand && (
        <aside className={`cp-stadium__seat-panel${viewMode === 'seat-pov' ? ' is-seat-pov' : ''}${isSeatPickerOpen ? ' is-expanded' : ''}`} aria-label={`${selectedStand.name} seat selection`}>
          <div className="cp-stadium__seat-head">
            <div><span className="cp-stadium__eyebrow">{selectedStand.tier} · from {price(selectedStand.basePrice)}</span><h2>{selectedStand.name}</h2></div>
            <button type="button" className="cp-stadium__icon-button" onClick={handleReturnToOverview} aria-label="Return to complete stadium view"><RotateCcw size={16} /></button>
          </div>
          {!(viewMode === 'seat-pov' && !isSeatPickerOpen) && <>
            <p className="cp-stadium__stand-description">{selectedStand.description}</p>
            <div className="cp-stadium__seat-caption"><span>Pick a seat</span><small>6 rows · 16 seats per row</small></div>
            <div className="cp-stadium__seat-grid">
            {rows.map((row) => (
              <div className="cp-stadium__seat-row" key={row}>
                <span>{row}</span>
                <div>
                  {standSeats.filter((seat) => seat.row === row).map((seat) => {
                    const selected = selectedIds.has(seat.id);
                    const reserved = seat.status === 'reserved';
                    return <button
                      key={seat.id}
                      type="button"
                      className={`cp-stadium__seat${selected ? ' is-selected' : ''}${activeViewingSeat?.id === seat.id ? ' is-viewing' : ''}${reserved ? ' is-reserved' : ''}`}
                      disabled={reserved}
                      aria-label={`Row ${seat.row}, seat ${seat.number}, ${price(seat.price)}${reserved ? ', unavailable' : ''}`}
                      aria-pressed={selected}
                      title={`Row ${seat.row} · Seat ${seat.number} · ${price(seat.price)}`}
                      onPointerEnter={() => setHoveredSeat(seat)}
                      onPointerLeave={() => setHoveredSeat(null)}
                      onFocus={() => setHoveredSeat(seat)}
                      onBlur={() => setHoveredSeat(null)}
                      onClick={() => handleToggleSeat(seat)}
                    />;
                  })}
                </div>
              </div>
            ))}
            </div>
            <div className="cp-stadium__legend"><span><i /> Available</span><span><i className="selected" /> Selected</span><span><i className="unavailable" /> Unavailable</span></div>
          </>}

          {seatLimitReached && <p className="cp-stadium__limit-note" role="status">A booking preview can include up to six seats.</p>}

          {activeViewingSeat && currentSightline && (
            <div className="cp-stadium__seat-view" aria-live="polite">
              <div className="cp-stadium__seat-view-title"><Eye size={15} /><strong>Your view</strong><span>{price(activeViewingSeat.price)}</span></div>
              <div className="cp-stadium__seat-meta"><span>Row <b>{activeViewingSeat.row}</b></span><span>Seat <b>{String(activeViewingSeat.number).padStart(2, '0')}</b></span><span>Pitch <b>{currentSightline.distanceToPitch}m</b></span></div>
              <small>{currentSightline.statusLabel}</small>
            </div>
          )}

          {viewMode === 'seat-pov' && (
            <button
              className="cp-stadium__picker-toggle"
              type="button"
              aria-expanded={isSeatPickerOpen}
              onClick={() => setIsSeatPickerOpen((open) => !open)}
            >
              {isSeatPickerOpen ? 'Keep this view' : 'Change seat or add extras'}
              <ChevronDown className={isSeatPickerOpen ? 'is-open' : ''} size={15} />
            </button>
          )}

          {(viewMode !== 'seat-pov' || isSeatPickerOpen) && <button className="cp-stadium__addon-toggle" type="button" aria-expanded={isAddonListOpen} onClick={() => setIsAddonListOpen((open) => !open)}>
            <span>Matchday extras <small>Optional</small></span><ChevronDown className={isAddonListOpen ? 'is-open' : ''} size={16} />
          </button>}
          {isAddonListOpen && (viewMode !== 'seat-pov' || isSeatPickerOpen) && <div className="cp-stadium__addons">
            {FAN_ADDONS.map((addon) => {
              const chosen = selectedAddons.find((item) => item.addon.id === addon.id);
              return <div className="cp-stadium__addon" key={addon.id}>
                <label><input type="checkbox" checked={Boolean(chosen)} onChange={() => handleToggleAddon(addon)} /><span><strong>{addon.name}</strong><small>{price(addon.price)} each</small></span></label>
                {chosen && <div className="cp-stadium__quantity"><button type="button" onClick={() => handleAddonQuantity(addon.id, -1)} aria-label={`Remove one ${addon.name}`}><Minus size={13} /></button><span>{chosen.quantity}</span><button type="button" onClick={() => handleAddonQuantity(addon.id, 1)} aria-label={`Add one ${addon.name}`}><Plus size={13} /></button></div>}
              </div>;
            })}
          </div>}
        </aside>
      )}

      <div className="cp-stadium__camera-controls">
        <button type="button" className={viewMode === 'overview' ? 'is-active' : ''} onClick={handleReturnToOverview}>Whole ground</button>
        {selectedStand && <button type="button" className={viewMode === 'stand' ? 'is-active' : ''} onClick={() => { setViewMode('stand'); setIsAutoRotate(false); setActiveViewingSeat(null); }}>Stand view</button>}
        <button type="button" onClick={() => setIsAutoRotate((current) => !current)}>{isAutoRotate ? 'Pause orbit' : 'Orbit'}</button>
      </div>

      <footer className="cp-stadium__booking-bar">
        <div className="cp-stadium__selection-summary">
          <span className="cp-stadium__eyebrow">Your selection</span>
          <strong>{selectedSeats.length ? `${selectedSeats.length} ${selectedSeats.length === 1 ? 'seat' : 'seats'} · ${selectedStand?.name}` : 'Choose a stand and seat'}</strong>
          <small>{selectedSeats.length ? `${selectedSeats.map((seat) => `${seat.row}${String(seat.number).padStart(2, '0')}`).join(', ')} · fees and tax included below` : 'The camera moves to each seat for its own pitch view.'}</small>
        </div>
        <div className="cp-stadium__total"><small>Estimated total</small><strong>{price(totals.total)}</strong></div>
        <button type="button" className="cp-stadium__checkout" disabled={!selectedStand || selectedSeats.length === 0} onClick={() => selectedStand && onProceedToCheckout(match, selectedStand, selectedSeats, selectedAddons)}>
          <Ticket size={16} /> Continue <Check size={15} />
        </button>
      </footer>

      {hoveredSeat && viewMode !== 'seat-pov' && <div className="cp-stadium__seat-tooltip" role="status">Row {hoveredSeat.row} · Seat {String(hoveredSeat.number).padStart(2, '0')} <b>{price(hoveredSeat.price)}</b></div>}
    </main>
  );
};
