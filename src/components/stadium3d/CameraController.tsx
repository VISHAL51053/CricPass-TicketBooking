import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import * as THREE from 'three';
import type { StandSection, Seat } from '../../types';
import { getSeatEyePosition } from '../../data/stadiumConfig';

export type CameraPerspective =
  | 'overview'
  | 'stadium-overview'
  | 'lower-stand'
  | 'upper-stand'
  | 'bowler-pov'
  | 'batsman-pov'
  | 'stand'
  | 'seat-pov';

interface CameraControllerProps {
  selectedStand: StandSection | null;
  selectedSeat?: Seat | null;
  viewMode: CameraPerspective;
  isAutoRotate: boolean;
  enableZoom?: boolean;
}

const MATCH_CENTRE: [number, number, number] = [0, 0.6, 0];

export const CameraController: React.FC<CameraControllerProps> = ({
  selectedStand,
  selectedSeat,
  viewMode,
  isAutoRotate,
  enableZoom = true
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const hasInitialized = useRef(false);
  const currentTween = useRef<gsap.core.Tween | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isOverviewView = viewMode === 'overview' || viewMode === 'stadium-overview';

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    let nextPosition: [number, number, number] = [0, 78, 118];
    let nextTarget: [number, number, number] = MATCH_CENTRE;
    let useArc = false;

    switch (viewMode) {
      case 'seat-pov':
        if (selectedStand && selectedSeat) {
          nextPosition = getSeatEyePosition(selectedStand.id, selectedSeat.row, selectedSeat.number);
          useArc = true;
        } else if (selectedStand) {
          nextPosition = selectedStand.povPosition;
          nextTarget = selectedStand.povTarget;
          useArc = true;
        }
        break;
      case 'stand':
        if (selectedStand) {
          nextPosition = selectedStand.cameraPosition;
          nextTarget = selectedStand.cameraTarget;
          useArc = true;
        }
        break;
      case 'bowler-pov':
        nextPosition = [0, 2, 14];
        nextTarget = [0, 0.8, -8];
        break;
      case 'batsman-pov':
        nextPosition = [0, 2, -14];
        nextTarget = [0, 0.8, 8];
        break;
      case 'lower-stand':
        nextPosition = [0, 8.5, 32];
        break;
      case 'upper-stand':
        nextPosition = [0, 24, 44];
        break;
      case 'stadium-overview':
        nextPosition = [26, 36, 42];
        break;
      case 'overview':
      default:
        nextPosition = [0, 78, 118];
        break;
    }

    const firstView = !hasInitialized.current;
    hasInitialized.current = true;
    if (firstView && !prefersReducedMotion) camera.position.set(0, 72, 98);
    if (firstView) {
      controls.target.set(...MATCH_CENTRE);
      controls.update();
    }

    currentTween.current?.kill();
    const fromPosition = camera.position.clone();
    const fromTarget = controls.target.clone();

    if (prefersReducedMotion) {
      camera.position.set(...nextPosition);
      controls.target.set(...nextTarget);
      controls.update();
      return;
    }

    const transition = { progress: 0 };
    currentTween.current = gsap.to(transition, {
      progress: 1,
      duration: firstView ? 1.65 : 1.25,
      ease: 'power3.inOut',
      onUpdate: () => {
        const progress = transition.progress;
        const arc = useArc ? Math.sin(progress * Math.PI) * 5.5 : 0;
        camera.position.set(
          THREE.MathUtils.lerp(fromPosition.x, nextPosition[0], progress),
          THREE.MathUtils.lerp(fromPosition.y, nextPosition[1], progress) + arc,
          THREE.MathUtils.lerp(fromPosition.z, nextPosition[2], progress)
        );
        controls.target.set(
          THREE.MathUtils.lerp(fromTarget.x, nextTarget[0], progress),
          THREE.MathUtils.lerp(fromTarget.y, nextTarget[1], progress),
          THREE.MathUtils.lerp(fromTarget.z, nextTarget[2], progress)
        );
        controls.update();
      }
    });

    return () => {
      currentTween.current?.kill();
      currentTween.current = null;
    };
  }, [camera, prefersReducedMotion, selectedSeat, selectedStand, viewMode]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.07}
      enableZoom={enableZoom && viewMode !== 'seat-pov'}
      enableRotate={viewMode !== 'seat-pov'}
      enablePan={false}
      autoRotate={isAutoRotate && viewMode === 'overview' && !prefersReducedMotion}
      autoRotateSpeed={0.22}
      minPolarAngle={0.18}
      maxPolarAngle={isOverviewView ? 1.02 : 1.2}
      minDistance={isOverviewView ? 68 : viewMode === 'stand' ? 30 : 0.1}
      maxDistance={isOverviewView ? 160 : viewMode === 'stand' ? 78 : 50}
      target={MATCH_CENTRE}
    />
  );
};
