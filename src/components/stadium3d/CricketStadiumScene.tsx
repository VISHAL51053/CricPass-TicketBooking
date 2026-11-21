import React from 'react';
import { Sky, Stars } from '@react-three/drei';
import type { StandSection, Seat, TimeOfDay } from '../../types';
import type { CameraPerspective } from './CameraController';
import { CricketPitch } from './CricketPitch';
import { StadiumLighting } from './StadiumLighting';
import { StadiumStands3D } from './StadiumStands3D';
import { InstancedSeats3D } from './InstancedSeats3D';
import { CameraController } from './CameraController';
import { SurroundingCity3D } from './SurroundingCity3D';
import { CricketBallTrajectory } from './CricketBallTrajectory';

interface CricketStadiumSceneProps {
  selectedStand: StandSection | null;
  onSelectStand: (stand: StandSection) => void;
  hoveredStand: StandSection | null;
  onHoverStand: (stand: StandSection | null) => void;
  seats: Seat[];
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  hoveredSeat: Seat | null;
  onHoverSeat: (seat: Seat | null) => void;
  timeOfDay: TimeOfDay;
  viewMode: CameraPerspective;
  isAutoRotate: boolean;
  selectedSeat?: Seat | null;
  isBallTrajectoryActive?: boolean;
  enableZoom?: boolean;
  enableCameraController?: boolean;
}

export const CricketStadiumScene: React.FC<CricketStadiumSceneProps> = ({
  selectedStand,
  onSelectStand,
  hoveredStand,
  onHoverStand,
  seats,
  selectedSeats,
  onToggleSeat,
  hoveredSeat,
  onHoverSeat,
  timeOfDay,
  viewMode,
  isAutoRotate,
  selectedSeat,
  isBallTrajectoryActive = true,
  enableZoom = true,
  enableCameraController = true
}) => {
  const isNight = timeOfDay === 'night';
  const isGoldenHour = timeOfDay === 'golden-hour';
  const isSunset = timeOfDay === 'sunset';

  // Sun position for physically based sky
  const sunPosition: [number, number, number] = isSunset
    ? [80, 8, 30]
    : isGoldenHour
    ? [65, 22, 40]
    : [35, 75, 25];

  // Natural Sky & Fog colors for each time of day
  const bgColor = isNight
    ? '#0c1424'
    : isSunset
    ? '#e07a5f'
    : isGoldenHour
    ? '#fcd394'
    : '#d9d6cc';

  const fogColor = isNight
    ? '#09101d'
    : isSunset
    ? '#d97459'
    : isGoldenHour
    ? '#f8ca88'
    : '#d4d0c5';

  return (
    <>
      {/* 1. Realistic Sky & Atmosphere */}
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 95, 340]} />

      {isNight ? (
        <Stars radius={220} depth={50} count={6000} factor={4} saturation={0} fade speed={1.2} />
      ) : (
        <Sky
          distance={450000}
          sunPosition={sunPosition}
          turbidity={isSunset ? 9 : isGoldenHour ? 7 : 8}
          rayleigh={isSunset ? 2.7 : isGoldenHour ? 0.8 : 0.08}
          mieCoefficient={0.006}
          mieDirectionalG={0.82}
        />
      )}

      {/* 2. Natural Stadium Lighting Architecture */}
      <StadiumLighting timeOfDay={timeOfDay} />

      {/* 3. Smooth Spatial Camera Controller */}
      {enableCameraController && (
        <CameraController
          selectedStand={selectedStand}
          selectedSeat={selectedSeat}
          viewMode={viewMode}
          isAutoRotate={isAutoRotate}
          enableZoom={enableZoom}
        />
      )}

      {/* 4. Surrounding 3D Metropolis, Plazas, Gates & Boulevards */}
      <SurroundingCity3D timeOfDay={timeOfDay} />

      {/* 5. Center 22-Yard Pitch & Outfield Oval */}
      <CricketPitch timeOfDay={timeOfDay} />

      {/* 6. Clean Colosseum Stands Architecture */}
      <StadiumStands3D
        selectedStand={selectedStand}
        onSelectStand={onSelectStand}
        hoveredStand={hoveredStand}
        onHoverStand={onHoverStand}
        timeOfDay={timeOfDay}
      />

      {/* 7. Individual Stand Seats */}
      <InstancedSeats3D
        stand={selectedStand}
        seats={seats}
        selectedSeats={selectedSeats}
        onToggleSeat={onToggleSeat}
        hoveredSeat={hoveredSeat}
        onHoverSeat={onHoverSeat}
        activeViewingSeat={selectedSeat}
      />

      {/* 8. 6-Hit Trajectory Arc Animation */}
      {isBallTrajectoryActive && <CricketBallTrajectory />}
    </>
  );
};
