import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { TimeOfDay } from '../../types';

interface CricketPitchProps { timeOfDay: TimeOfDay; }

const seededRandom = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

export const CricketPitch: React.FC<CricketPitchProps> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden-hour';
  const isSunset = timeOfDay === 'sunset';

  const { grassTexture, pitchTexture } = useMemo(() => {
    const random = seededRandom(39713);
    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = 1024;
    grassCanvas.height = 1024;
    const grass = grassCanvas.getContext('2d')!;
    grass.fillStyle = '#326b3d';
    grass.fillRect(0, 0, 1024, 1024);

    const broadTone = grass.createRadialGradient(490, 490, 95, 510, 510, 690);
    broadTone.addColorStop(0, 'rgba(79, 127, 64, .18)');
    broadTone.addColorStop(0.65, 'rgba(73, 113, 56, .03)');
    broadTone.addColorStop(1, 'rgba(20, 52, 30, .22)');
    grass.fillStyle = broadTone;
    grass.fillRect(0, 0, 1024, 1024);

    // Fine, restrained groundkeeper bands and a little blade detail break up the flat field.
    for (let band = 0; band < 14; band += 1) {
      grass.beginPath();
      grass.ellipse(512, 512, 490 - band * 23, 478 - band * 20, 0, 0, Math.PI * 2);
      grass.strokeStyle = band % 2 ? 'rgba(184, 198, 126, .026)' : 'rgba(21, 58, 33, .032)';
      grass.lineWidth = 13;
      grass.stroke();
    }
    for (let blade = 0; blade < 21000; blade += 1) {
      const x = random() * 1024;
      const y = random() * 1024;
      grass.strokeStyle = random() > 0.5 ? 'rgba(202, 211, 143, .11)' : 'rgba(16, 57, 31, .11)';
      grass.lineWidth = random() > 0.8 ? 1.5 : 1;
      grass.beginPath();
      grass.moveTo(x, y);
      grass.lineTo(x + (random() - 0.5) * 3, y - 2 - random() * 5);
      grass.stroke();
    }
    const grassTexture = new THREE.CanvasTexture(grassCanvas);
    grassTexture.colorSpace = THREE.SRGBColorSpace;
    grassTexture.anisotropy = 4;

    const pitchCanvas = document.createElement('canvas');
    pitchCanvas.width = 512;
    pitchCanvas.height = 1024;
    const pitch = pitchCanvas.getContext('2d')!;
    const clay = pitch.createLinearGradient(0, 0, 512, 0);
    clay.addColorStop(0, '#99764f');
    clay.addColorStop(0.2, '#b49770');
    clay.addColorStop(0.52, '#c3a47b');
    clay.addColorStop(0.82, '#b0926a');
    clay.addColorStop(1, '#94724d');
    pitch.fillStyle = clay;
    pitch.fillRect(0, 0, 512, 1024);
    for (let fleck = 0; fleck < 12500; fleck += 1) {
      const light = random() > 0.52;
      pitch.fillStyle = light ? 'rgba(238, 212, 166, .09)' : 'rgba(80, 57, 36, .1)';
      const x = random() * 512;
      const y = random() * 1024;
      pitch.fillRect(x, y, 1 + random() * 3, 1 + random() * 5);
    }
    for (const creaseY of [140, 200, 824, 884]) {
      pitch.strokeStyle = 'rgba(247, 242, 226, .88)';
      pitch.lineWidth = creaseY === 200 || creaseY === 824 ? 4 : 3;
      pitch.beginPath();
      pitch.moveTo(45, creaseY);
      pitch.lineTo(467, creaseY);
      pitch.stroke();
    }
    pitch.strokeStyle = 'rgba(247, 242, 226, .82)';
    pitch.lineWidth = 3;
    for (const y of [110, 824]) {
      pitch.beginPath();
      pitch.moveTo(96, y);
      pitch.lineTo(96, y + 90);
      pitch.moveTo(416, y);
      pitch.lineTo(416, y + 90);
      pitch.stroke();
    }
    const pitchTexture = new THREE.CanvasTexture(pitchCanvas);
    pitchTexture.colorSpace = THREE.SRGBColorSpace;
    pitchTexture.anisotropy = 4;
    return { grassTexture, pitchTexture };
  }, []);

  useEffect(() => () => {
    grassTexture.dispose();
    pitchTexture.dispose();
  }, [grassTexture, pitchTexture]);

  const turfColor = isNight ? '#254d2f' : isSunset ? '#37653a' : isGolden ? '#477442' : '#3d713e';

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[27.8, 96]} />
        <meshStandardMaterial map={grassTexture} color={turfColor} roughness={0.9} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[12.35, 12.46, 96]} />
        <meshBasicMaterial color="#e9e5cf" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.075, 0]}>
        <torusGeometry args={[25.9, 0.12, 8, 96]} />
        <meshStandardMaterial color="#e9e5d8" roughness={0.72} />
      </mesh>

      {Array.from({ length: 36 }, (_, index) => {
        const angle = (index / 36) * Math.PI * 2;
        const radius = 26.35;
        return <mesh key={`boundary-board-${index}`} position={[radius * Math.sin(angle), 0.22, radius * Math.cos(angle)]} rotation={[0, angle + Math.PI / 2, 0]}>
          <boxGeometry args={[1.8, 0.42, 0.32]} />
          <meshStandardMaterial color={index % 3 === 0 ? '#e78260' : '#403f39'} roughness={0.62} metalness={0.02} />
        </mesh>;
      })}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 0]} receiveShadow>
        <planeGeometry args={[3.05, 20.12]} />
        <meshStandardMaterial map={pitchTexture} roughness={0.88} metalness={0} />
      </mesh>

      {([-7.6, 7.6] as const).map((z, endIndex) => (
        <group key={`wicket-end-${endIndex}`} position={[0, 0.025, z]}>
          {[-0.13, 0, 0.13].map((xOffset, wicketIndex) => (
            <mesh key={`stump-${endIndex}-${wicketIndex}`} position={[xOffset, 0.355, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.71, 12]} />
              <meshStandardMaterial color="#f3efe6" roughness={0.38} metalness={0.02} />
            </mesh>
          ))}
          <mesh position={[-0.065, 0.725, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.14, 8]} />
            <meshStandardMaterial color="#e78260" roughness={0.45} />
          </mesh>
          <mesh position={[0.065, 0.725, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.14, 8]} />
            <meshStandardMaterial color="#e78260" roughness={0.45} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
