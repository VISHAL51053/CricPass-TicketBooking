import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CricketBallTrajectoryProps {
  isPlaying?: boolean;
}

const MAX_TRAIL_POINTS = 30;
const TRAIL_SAMPLE_INTERVAL = 1 / 18;

export const CricketBallTrajectory: React.FC<CricketBallTrajectoryProps> = ({ isPlaying = true }) => {
  const ballRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  const pointsRef = useRef(0);
  const sampleClockRef = useRef(0);
  const position = useRef(new THREE.Vector3());
  const start = useRef(new THREE.Vector3());
  const peak = useRef(new THREE.Vector3());
  const end = useRef(new THREE.Vector3());
  const { lineObject, lineGeometry, lineMaterial } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_TRAIL_POINTS * 3), 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.LineBasicMaterial({ color: 0xe78260, transparent: true, opacity: 0.85 });
    const line = new THREE.Line(geometry, material);
    line.frustumCulled = false;
    return { lineObject: line, lineGeometry: geometry, lineMaterial: material };
  }, []);

  useEffect(() => () => {
    lineGeometry.dispose();
    lineMaterial.dispose();
  }, [lineGeometry, lineMaterial]);

  useFrame((_, delta) => {
    if (!isPlaying || !ballRef.current) return;

    progressRef.current = (progressRef.current + delta * 0.32) % 1;
    const progress = progressRef.current;
    const currentPosition = position.current;
    if (progress < 0.25) {
      const t = progress / 0.25;
      currentPosition.set(0, 2.2, 8.5).lerp(start.current.set(0.08, 0.05, 1.4), t);
      currentPosition.y += Math.sin(t * Math.PI) * 0.25;
    } else if (progress < 0.4) {
      const t = (progress - 0.25) / 0.15;
      currentPosition.set(0.08, 0.05, 1.4).lerp(end.current.set(0, 0.75, -3.4), t);
      currentPosition.y += Math.sin(t * Math.PI) * 0.45;
    } else {
      const t = (progress - 0.4) / 0.6;
      start.current.set(0, 0.75, -3.4);
      peak.current.set(22, 19.5, 6);
      end.current.set(38, 13, 14);
      const inverse = 1 - t;
      currentPosition.set(
        inverse * inverse * start.current.x + 2 * inverse * t * peak.current.x + t * t * end.current.x,
        inverse * inverse * start.current.y + 2 * inverse * t * peak.current.y + t * t * end.current.y,
        inverse * inverse * start.current.z + 2 * inverse * t * peak.current.z + t * t * end.current.z
      );
    }

    ballRef.current.position.copy(currentPosition);
    ballRef.current.rotation.x += 0.2;
    ballRef.current.rotation.y += 0.15;
    sampleClockRef.current += delta;
    if (sampleClockRef.current < TRAIL_SAMPLE_INTERVAL) return;
    sampleClockRef.current = 0;

    const attribute = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
    const values = attribute.array as Float32Array;
    if (pointsRef.current >= MAX_TRAIL_POINTS) {
      values.copyWithin(0, 3);
      pointsRef.current = MAX_TRAIL_POINTS - 1;
    }
    const offset = pointsRef.current * 3;
    values[offset] = currentPosition.x;
    values[offset + 1] = currentPosition.y;
    values[offset + 2] = currentPosition.z;
    pointsRef.current += 1;
    attribute.needsUpdate = true;
    lineGeometry.setDrawRange(0, pointsRef.current);
  });

  return (
    <group>
      <mesh ref={ballRef} position={[0, 2.2, 8.5]} castShadow>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.32} metalness={0.02} />
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.076, 0.007, 6, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </mesh>
      <primitive object={lineObject} />
    </group>
  );
};
