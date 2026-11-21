import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { StandSection, Seat, TimeOfDay } from '../../types';
import type { CameraPerspective } from './CameraController';
import { CricketStadiumScene } from './CricketStadiumScene';
import { Sun, Moon, RotateCcw, Play, Pause, Eye, Maximize2, Compass } from 'lucide-react';

interface CricketStadiumCanvasProps {
  selectedStand: StandSection | null;
  onSelectStand: (stand: StandSection) => void;
  seats: Seat[];
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  className?: string;
  initialTimeOfDay?: TimeOfDay;
}

export const CricketStadiumCanvas: React.FC<CricketStadiumCanvasProps> = ({
  selectedStand,
  onSelectStand,
  seats,
  selectedSeats,
  onToggleSeat,
  className = 'w-full h-full min-h-[500px]',
  initialTimeOfDay = 'day'
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(initialTimeOfDay);
  const [viewMode, setViewMode] = useState<CameraPerspective>(
    selectedStand ? 'stand' : 'overview'
  );
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(selectedStand === null);
  const [hoveredStand, setHoveredStand] = useState<StandSection | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  const toggleTimeOfDay = () => {
    setTimeOfDay(prev => (prev === 'night' ? 'day' : 'night'));
  };

  const handleResetCamera = () => {
    setViewMode('overview');
    setIsAutoRotate(true);
  };

  return (
    <div className={`relative overflow-hidden border border-[#292929] bg-[#F3EFE6] select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 36, 56], fov: 45 }}
      >
        <Suspense fallback={null}>
          <CricketStadiumScene
            selectedStand={selectedStand}
            onSelectStand={(stand) => {
              onSelectStand(stand);
              setViewMode('stand');
              setIsAutoRotate(false);
            }}
            hoveredStand={hoveredStand}
            onHoverStand={setHoveredStand}
            seats={seats}
            selectedSeats={selectedSeats}
            onToggleSeat={onToggleSeat}
            hoveredSeat={hoveredSeat}
            onHoverSeat={setHoveredSeat}
            timeOfDay={timeOfDay}
            viewMode={viewMode}
            isAutoRotate={isAutoRotate}
          />
        </Suspense>
      </Canvas>

      {/* Top Floating Architectural Status Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 bg-[#292929] text-[#F3EFE6] border border-[#292929] shadow-[2px_2px_0px_#E78260] font-mono text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E78260] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E78260]"></span>
          </span>
          <span className="font-bold tracking-widest uppercase">
            {viewMode === 'overview'
              ? 'ARENA OVERVIEW · 360°'
              : viewMode === 'stand'
              ? `${selectedStand?.name.toUpperCase() || 'STAND ZOOM'}`
              : viewMode === 'bowler-pov'
              ? "BOWLER'S END CREASE POV"
              : viewMode === 'batsman-pov'
              ? "BATSMAN'S STRIKE POV"
              : 'SIGHTLINE FROM SEAT'}
          </span>
          {selectedStand && (
            <span className="ml-1 px-1.5 py-0.5 bg-[#E78260] text-[#F3EFE6] font-bold text-[10px]">
              ₹{selectedStand.basePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Lighting & Camera Quick Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#F3EFE6] p-1 border border-[#292929] shadow-[2px_2px_0px_#292929]">
          <button
            onClick={toggleTimeOfDay}
            title={timeOfDay === 'night' ? 'Switch to Day Light' : 'Switch to Floodlit Night'}
            className="p-1.5 border border-[#292929] bg-[#F3EFE6] hover:bg-[#292929] hover:text-[#F3EFE6] transition-colors active:translate-y-0.5 text-[#292929]"
          >
            {timeOfDay === 'night' ? (
              <Moon className="w-3.5 h-3.5 text-[#E78260]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-[#E78260]" />
            )}
          </button>

          <button
            onClick={() => setIsAutoRotate(prev => !prev)}
            title={isAutoRotate ? 'Pause Orbit' : 'Resume Orbit'}
            className={`p-1.5 border border-[#292929] transition-colors active:translate-y-0.5 ${
              isAutoRotate
                ? 'bg-[#292929] text-[#F3EFE6]'
                : 'bg-[#F3EFE6] text-[#292929] hover:bg-[#292929]/10'
            }`}
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Perspective"
            className="p-1.5 border border-[#292929] bg-[#F3EFE6] text-[#292929] hover:bg-[#292929] hover:text-[#F3EFE6] transition-colors active:translate-y-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Perspective Mode Switcher Pills Bottom HUD */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-wrap items-center justify-center gap-1 p-1 bg-[#F3EFE6]/95 backdrop-blur-sm border border-[#292929] shadow-[3px_3px_0px_#292929] z-10 max-w-[95%]">
        <button
          onClick={() => { setViewMode('overview'); setIsAutoRotate(true); }}
          className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 border ${
            viewMode === 'overview'
              ? 'bg-[#292929] text-[#F3EFE6] border-[#292929]'
              : 'bg-[#F3EFE6] text-[#292929] border-transparent hover:border-[#292929]'
          }`}
        >
          <Maximize2 className="w-3 h-3 text-[#E78260]" />
          Aerial 360°
        </button>

        <button
          disabled={!selectedStand}
          onClick={() => { if (selectedStand) { setViewMode('stand'); setIsAutoRotate(false); } }}
          className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 border disabled:opacity-40 disabled:cursor-not-allowed ${
            viewMode === 'stand'
              ? 'bg-[#292929] text-[#F3EFE6] border-[#292929]'
              : 'bg-[#F3EFE6] text-[#292929] border-transparent hover:border-[#292929]'
          }`}
        >
          <Compass className="w-3 h-3 text-[#E78260]" />
          Stand Zoom
        </button>

        <button
          onClick={() => { setViewMode('bowler-pov'); setIsAutoRotate(false); }}
          className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 border ${
            viewMode === 'bowler-pov'
              ? 'bg-[#292929] text-[#F3EFE6] border-[#292929]'
              : 'bg-[#F3EFE6] text-[#292929] border-transparent hover:border-[#292929]'
          }`}
        >
          Bowler POV
        </button>

        <button
          onClick={() => { setViewMode('batsman-pov'); setIsAutoRotate(false); }}
          className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 border ${
            viewMode === 'batsman-pov'
              ? 'bg-[#292929] text-[#F3EFE6] border-[#292929]'
              : 'bg-[#F3EFE6] text-[#292929] border-transparent hover:border-[#292929]'
          }`}
        >
          Batsman POV
        </button>

        <button
          disabled={!selectedStand}
          onClick={() => { if (selectedStand) { setViewMode('seat-pov'); setIsAutoRotate(false); } }}
          className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 border disabled:opacity-40 disabled:cursor-not-allowed ${
            viewMode === 'seat-pov'
              ? 'bg-[#292929] text-[#F3EFE6] border-[#292929]'
              : 'bg-[#F3EFE6] text-[#292929] border-transparent hover:border-[#292929]'
          }`}
        >
          <Eye className="w-3 h-3 text-[#E78260]" />
          Seat Sightline
        </button>
      </div>

      {/* Floating Hover Information Callout */}
      {(hoveredStand || hoveredSeat) && (
        <div className="absolute top-16 left-4 pointer-events-none p-4 bg-[#F3EFE6] border border-[#292929] shadow-[3px_3px_0px_#292929] font-mono z-20 max-w-xs animate-in fade-in duration-100">
          {hoveredSeat ? (
            <div>
              <div className="text-[10px] font-bold text-[#E78260] uppercase tracking-wider">
                TACTILE SEAT COORDINATE
              </div>
              <div className="text-base font-bold text-[#292929] mt-0.5">
                Row {hoveredSeat.row} · Seat #{hoveredSeat.number.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-[#292929]/70 mt-1">
                Tier: {hoveredSeat.tier}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#292929]/20 text-xs">
                <span className="text-[#292929]/70">Pass Valuation:</span>
                <span className="font-bold text-[#E78260]">₹{hoveredSeat.price.toLocaleString()}</span>
              </div>
              <div className="mt-1 text-[10px] text-[#292929] font-bold">
                {hoveredSeat.status === 'reserved'
                  ? '● OCCUPIED / ALLOCATED'
                  : '▲ CLICK TO TOGGLE PASS SELECTION'}
              </div>
            </div>
          ) : hoveredStand ? (
            <div>
              <div className="text-[10px] font-bold text-[#E78260] uppercase tracking-wider">
                {hoveredStand.category} · {hoveredStand.tier}
              </div>
              <div className="font-serif text-base font-bold text-[#292929] mt-0.5">
                {hoveredStand.name}
              </div>
              <p className="text-[11px] text-[#292929]/80 mt-1 leading-relaxed line-clamp-2">
                {hoveredStand.description}
              </p>
              <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#292929]/20 text-xs">
                <span className="text-[#292929]/70">{hoveredStand.availableSeats} passes left</span>
                <span className="font-bold text-[#E78260]">From ₹{hoveredStand.basePrice.toLocaleString()}</span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
