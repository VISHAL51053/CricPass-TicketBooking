import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { TimeOfDay } from '../../types';

interface StadiumLightingProps {
  timeOfDay: TimeOfDay;
}

export const StadiumLighting: React.FC<StadiumLightingProps> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';
  const isGolden = timeOfDay === 'golden-hour';
  const floodlightTargets = useMemo(() => Array.from({ length: 4 }, () => new THREE.Object3D()), []);

  // Sunlight chromatic color temperature & position
  const sunColor = isSunset ? '#ff7b47' : isGolden ? '#fcd34d' : '#fffcf5';
  const sunIntensity = isSunset ? 1.5 : isGolden ? 1.8 : 2.2;
  const sunPos: [number, number, number] = isSunset
    ? [65, 18, 30]
    : isGolden
    ? [55, 34, 38]
    : [35, 65, 30];

  // Ambient skylight fill colors (prevents crushed black stadium interiors)
  const skyColor = isNight
    ? '#859097'
    : isSunset
    ? '#fdba74'
    : isGolden
    ? '#fed7aa'
    : '#f2ecdf';

  const groundColor = isNight
    ? '#314433'
    : isSunset
    ? '#7c2d12'
    : isGolden
    ? '#4d5d3e'
    : '#3c5838';

  return (
    <group>
      {/* 1. Hemisphere Light for Natural Atmospheric Sky & Ground Illumination */}
      <hemisphereLight
        color={skyColor}
        groundColor={groundColor}
        intensity={isNight ? 0.82 : 1.25}
      />

      {/* 2. Soft Ambient Fill for Interior Seating & Stadium Concourses */}
      <ambientLight
        intensity={isNight ? 0.66 : 0.85}
        color={isNight ? '#d6c9ad' : isSunset ? '#fed7aa' : '#fff9ed'}
      />

      {/* 3. Primary Key Directional Light (Sun) */}
      {!isNight ? (
        <directionalLight
          position={sunPos}
          intensity={sunIntensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={180}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
          shadow-bias={-0.00015}
          shadow-normalBias={0.02}
          color={sunColor}
        />
      ) : (
        <directionalLight
          position={[10, 45, 10]}
          intensity={0.32}
          color="#e7d8b6"
        />
      )}

      {/* 4. Secondary Bounce / Fill Light from Opposite Sky Frustum */}
      <directionalLight
        position={[-30, 35, -30]}
        intensity={isNight ? 0.42 : 0.48}
        color={isNight ? '#aab0a8' : '#eee7d8'}
      />

      {/* 5. Aim each floodlight into the bowl; its target is a scene object so
          Three.js can calculate the spotlight direction correctly. */}
      {isNight && (
        <group>
          {[
            [34, 34, 34], [-34, 34, 34], [34, 34, -34], [-34, 34, -34]
          ].map((position, index) => (
            <React.Fragment key={`stadium-floodlight-${index}`}>
              <primitive object={floodlightTargets[index]} position={[0, 0.45, 0]} />
              <spotLight
                position={position as [number, number, number]}
                target={floodlightTargets[index]}
                intensity={24000}
                angle={1.18}
                penumbra={0.68}
                distance={190}
                decay={2}
                color="#fff0d5"
              />
            </React.Fragment>
          ))}

          {/* Warm concourse bounce keeps the lower rows readable under the roof. */}
          {[
            [18, 14, 18], [-18, 14, 18], [18, 14, -18], [-18, 14, -18]
          ].map((position, index) => (
            <pointLight
              key={`concourse-fill-${index}`}
              position={position as [number, number, number]}
              intensity={750}
              distance={72}
              decay={2}
              color="#f0d7a5"
            />
          ))}
        </group>
      )}
    </group>
  );
};
