import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Seat, StandSection } from '../../types';
import { getSeatWorldPosition } from '../../data/stadiumConfig';

interface InstancedSeats3DProps {
  stand: StandSection | null;
  seats: Seat[];
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  hoveredSeat: Seat | null;
  onHoverSeat: (seat: Seat | null) => void;
  activeViewingSeat?: Seat | null;
}

const SEAT_COLORS = {
  available: new THREE.Color('#d9d0bd'),
  selected: new THREE.Color('#e78260'),
  reserved: new THREE.Color('#55554e'),
  vip: new THREE.Color('#f2b291'),
  hovered: new THREE.Color('#ff9f80'),
  viewing: new THREE.Color('#fff3dc')
};

const makeSeatGeometry = () => {
  const parts = [
    new THREE.BoxGeometry(0.66, 0.12, 0.48).translate(0, 0.22, 0),
    new THREE.BoxGeometry(0.66, 0.5, 0.1).translate(0, 0.48, -0.19),
    new THREE.BoxGeometry(0.09, 0.3, 0.09).translate(-0.25, 0.1, 0.16),
    new THREE.BoxGeometry(0.09, 0.3, 0.09).translate(0.25, 0.1, 0.16)
  ];
  const geometry = mergeGeometries(parts, false);
  parts.forEach((part) => part.dispose());
  if (!geometry) throw new Error('Unable to build the seat geometry.');
  geometry.computeVertexNormals();
  return geometry;
};

export const InstancedSeats3D: React.FC<InstancedSeats3DProps> = ({
  stand,
  seats,
  selectedSeats,
  onToggleSeat,
  hoveredSeat,
  onHoverSeat,
  activeViewingSeat
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const geometry = useMemo(() => makeSeatGeometry(), []);

  useEffect(() => () => {
    geometry.dispose();
    document.body.style.cursor = '';
  }, [geometry]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !stand || seats.length === 0) return;

    seats.forEach((seat, index) => {
      const [x, y, z] = getSeatWorldPosition(stand.id, seat.row, seat.number);
      dummy.current.position.set(x, y - 0.22, z);
      dummy.current.scale.setScalar(0.7);
      dummy.current.lookAt(0, 0.6, 0);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(index, dummy.current.matrix);

      const isSelected = selectedSeats.some((item) => item.id === seat.id);
      const isViewing = activeViewingSeat?.id === seat.id;
      const isHovered = hoveredSeat?.id === seat.id;
      const color = isViewing
        ? SEAT_COLORS.viewing
        : isSelected
          ? SEAT_COLORS.selected
          : isHovered && seat.status !== 'reserved'
            ? SEAT_COLORS.hovered
            : seat.status === 'reserved'
              ? SEAT_COLORS.reserved
              : seat.status === 'vip'
                ? SEAT_COLORS.vip
                : SEAT_COLORS.available;
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [activeViewingSeat, hoveredSeat, seats, selectedSeats, stand]);

  if (!stand || seats.length === 0) return null;

  const viewingCoords = activeViewingSeat
    ? getSeatWorldPosition(stand.id, activeViewingSeat.row, activeViewingSeat.number)
    : null;

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[geometry, undefined, seats.length]}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          const seat = event.instanceId === undefined ? undefined : seats[event.instanceId];
          if (seat && seat.status !== 'reserved') onToggleSeat(seat);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
          const seat = event.instanceId === undefined ? undefined : seats[event.instanceId];
          if (seat) onHoverSeat(seat);
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
          onHoverSeat(null);
        }}
      >
        <meshStandardMaterial roughness={0.64} metalness={0.02} />
      </instancedMesh>

      {viewingCoords && (
        <group position={[viewingCoords[0], viewingCoords[1] + 1.1, viewingCoords[2]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.28, 0.36, 24]} />
            <meshBasicMaterial color="#e78260" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.8, 8]} />
            <meshBasicMaterial color="#e78260" />
          </mesh>
          <mesh position={[0, 0.84, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#fff3dc" />
          </mesh>
        </group>
      )}
    </group>
  );
};
