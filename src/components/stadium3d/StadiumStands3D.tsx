import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { StandSection, TimeOfDay } from '../../types';
import { STADIUM_STANDS, STAND_SECTORS } from '../../data/stadiumConfig';

interface StadiumStands3DProps {
  selectedStand: StandSection | null;
  onSelectStand: (stand: StandSection) => void;
  hoveredStand: StandSection | null;
  onHoverStand: (stand: StandSection | null) => void;
  timeOfDay: TimeOfDay;
}

export const StadiumStands3D: React.FC<StadiumStands3DProps> = ({
  selectedStand,
  onSelectStand,
  hoveredStand,
  onHoverStand,
  timeOfDay
}) => {
  const [internalHover, setInternalHover] = useState<string | null>(null);
  const isNight = timeOfDay === 'night';
  const facadeLiftRef = useRef<THREE.Group>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useFrame(({ clock }) => {
    if (prefersReducedMotion || !facadeLiftRef.current) return;
    const travel = 0.5 - Math.cos((clock.elapsedTime / 22) * Math.PI * 2) * 0.5;
    facadeLiftRef.current.position.y = 3 + travel * 13;
  });

  // High-Fidelity Spectator Crowd Texture
  const crowdTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Concrete tiered step background
    ctx.fillStyle = '#22252c';
    ctx.fillRect(0, 0, 1024, 256);

    // Horizontal concrete aisle lines
    ctx.strokeStyle = '#181a1f';
    ctx.lineWidth = 2;
    for (let y = 32; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Muted crowd tones support the warm field and CRICPASS palette.
    const fanColors = [
      '#F3EFE6', '#F3EFE6', '#E78260', '#E78260', '#292929',
      '#8a8479', '#5f795d', '#c5bcae', '#ddd4c7', '#756e64'
    ];
    const random = (row: number, column: number, salt = 0) => {
      const value = Math.sin(row * 12.9898 + column * 78.233 + salt * 37.719 + 741) * 43758.5453;
      return value - Math.floor(value);
    };

    // Clustered spectators
    for (let row = 6; row < 256; row += 10) {
      for (let col = 4; col < 1024; col += 6) {
        if (random(row, col) > 0.12) {
          ctx.fillStyle = fanColors[Math.floor(random(row, col, 1) * fanColors.length)];
          ctx.beginPath();
          ctx.arc(col + (random(row, col, 2) - 0.5) * 2, row, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 1);
    return texture;
  }, []);

  // Digital Scoreboard LED Display Texture
  const scoreboardTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Deep stadium screen black
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, 1024, 512);

    // Glowing border frame in Terracotta
    ctx.strokeStyle = '#E78260';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 1012, 500);

    // A neutral sign stays accurate for every selected fixture.
    ctx.fillStyle = '#E78260';
    ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CRICPASS · MATCHDAY VIEW', 50, 65);

    // Teams & Scores
    ctx.fillStyle = '#F3EFE6';
    ctx.font = 'bold 72px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('THE PITCH', 50, 175);
    ctx.fillText('FROM YOUR SEAT', 50, 265);

    ctx.font = '32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('3D SEAT PREVIEW', 50, 325);
    ctx.fillText('CHOOSE A SECTION TO BEGIN', 50, 375);

    // Opponent Target
    ctx.fillStyle = '#E78260';
    ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('YOUR VIEW', 600, 175);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('STAND', 600, 225);
    ctx.fillText('ROW · SEAT', 600, 285);

    // Live Watermark
    ctx.fillStyle = '#E78260';
    ctx.fillRect(50, 430, 16, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('INTERACTIVE STADIUM MODEL', 78, 444);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  const activeHoverStandId = hoveredStand?.id || internalHover;

  return (
    <group position={[0, 0, 0]}>
      {/* =========================================================================
          1. 8 DISTINCT INTERACTIVE 3D STADIUM SECTORS
          ========================================================================= */}
      {STADIUM_STANDS.map((stand) => {
        const sector = STAND_SECTORS[stand.id];
        if (!sector) return null;

        const isSelected = selectedStand?.id === stand.id;
        const isHovered = activeHoverStandId === stand.id;
        const thetaStart = sector.angleStart;
        const thetaLength = sector.angleEnd - sector.angleStart;

        return (
          <group key={`stand-sector-${stand.id}`}>
            {/* Clickable and Hoverable 3D Sector Seating Arc Mesh */}
            <mesh
              position={[0, (sector.baseHeight + sector.topHeight) / 2, 0]}
              receiveShadow
              onClick={(e) => {
                e.stopPropagation();
                onSelectStand(stand);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setInternalHover(stand.id);
                onHoverStand(stand);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setInternalHover(null);
                onHoverStand(null);
                document.body.style.cursor = 'auto';
              }}
            >
              <cylinderGeometry
                args={[
                  sector.outerRadius,
                  sector.innerRadius,
                  sector.topHeight - sector.baseHeight,
                  48,
                  4,
                  true,
                  thetaStart,
                  thetaLength
                ]}
              />
              <meshStandardMaterial
                map={crowdTexture}
                color="#ffffff"
                emissive={isHovered ? '#E78260' : '#000000'}
                emissiveIntensity={isHovered ? 0.1 : 0}
                roughness={0.7}
                metalness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* A fine upper-rake marker keeps the selected stand legible without
                painting a broad orange stripe across the spectator's view. */}
            {(isSelected || isHovered) && (
              <mesh
                position={[0, sector.topHeight + 0.04, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry
                  args={[
                    sector.outerRadius - 0.18,
                    sector.outerRadius + 0.03,
                    32,
                    1,
                    thetaStart,
                    thetaLength
                  ]}
                />
                <meshBasicMaterial
                  color={isSelected ? '#E78260' : '#F3EFE6'}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

          </group>
        );
      })}

      {/* =========================================================================
          2. CONCRETE SUBSTRUCTURE & STEPPED TIERS
          ========================================================================= */}
      {/* Front-Row Safety Glass Balustrade Barrier */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[27.2, 27.2, 0.9, 80, 1, true]} />
        <meshStandardMaterial
          color="#d2c9b7"
          transparent
          opacity={0.2}
          roughness={0.28}
          metalness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Stainless Steel Handrail Cap */}
      <mesh position={[0, 1.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[27.2, 0.05, 8, 80]} />
        <meshStandardMaterial color="#f1eadb" metalness={0.28} roughness={0.32} />
      </mesh>

      {/* Stepped Tier Access Steps (Horizontal Rake) */}
      {[1, 2, 3, 4, 5].map((step) => (
        <mesh key={`tier1-step-${step}`} position={[0, step * 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[27.2 + step * 1.15, 27.4 + step * 1.15, 80]} />
          <meshStandardMaterial color="#2d3037" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* 8 Vomitory Stadium Entry Tunnels */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = 30.5 * Math.sin(angle);
        const z = 30.5 * Math.cos(angle);
        return (
          <group key={`vomitory-${i}`} position={[x, 1.8, z]} rotation={[0, angle + Math.PI, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.4, 2.8, 4.0]} />
              <meshStandardMaterial color="#1a1c22" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, 2.05]}>
              <planeGeometry args={[2.0, 2.4]} />
              <meshBasicMaterial color={isNight ? '#ffe4a0' : '#22252b'} />
            </mesh>
          </group>
        );
      })}

      {/* Lower Bowl Perimeter Concrete Boundary Wall */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[26.9, 26.9, 0.7, 80, 1, true]} />
        <meshStandardMaterial color="#59554d" metalness={0.16} roughness={0.78} side={THREE.DoubleSide} />
      </mesh>

      {/* =========================================================================
          3. TIER 2: VIP LUXURY CORPORATE SUITES & CONCOURSE MEZZANINE
          ========================================================================= */}
      <mesh position={[0, 7.6, 0]}>
        <cylinderGeometry args={[36.8, 33.8, 3.4, 80, 1, true]} />
        <meshStandardMaterial
          color="#8b8579"
          roughness={0.58}
          metalness={0.16}
          transparent
          opacity={0.58}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corporate Balcony Mezzanine Deck */}
      <mesh position={[0, 6.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[33.8, 36.8, 80]} />
        <meshStandardMaterial color="#292929" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Terracotta Architectural Balustrade Rim */}
      <mesh position={[0, 6.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[34.0, 0.12, 8, 80]} />
        <meshStandardMaterial color="#E78260" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* =========================================================================
          4. TIER 3: UPPER GRANDSTAND COLOSSEUM BOWL & FACADE
          ========================================================================= */}
      <mesh position={[0, 13.8, 0]} receiveShadow>
        <cylinderGeometry args={[44.5, 36.8, 9.4, 80, 4, true]} />
        <meshStandardMaterial
          map={crowdTexture}
          roughness={0.75}
          metalness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Exterior Architectural Colosseum Facade Cladding */}
      <mesh position={[0, 10.2, 0]}>
        <cylinderGeometry args={[44.8, 38.6, 20.4, 80, 1, true]} />
        <meshStandardMaterial
          color="#766f63"
          roughness={0.82}
          metalness={0.08}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Exterior Structural Vertical Ribs / Buttresses */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const x = 42.0 * Math.sin(angle);
        const z = 42.0 * Math.cos(angle);
        return (
          <mesh key={`buttress-${i}`} position={[x, 10.2, z]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.36, 18, 1.45]} />
            <meshStandardMaterial color="#6b655a" roughness={0.78} metalness={0.12} />
          </mesh>
        );
      })}

      {/* =========================================================================
          5. CANTILEVERED STEEL TRUSS ROOF ARCHITECTURE
          ========================================================================= */}
      {/* 24 Structural Cantilever Steel Truss Girders */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const xOuter = 46.2 * Math.sin(angle);
        const zOuter = 46.2 * Math.cos(angle);
        const xInner = 35.8 * Math.sin(angle);
        const zInner = 35.8 * Math.cos(angle);
        const midX = (xOuter + xInner) / 2;
        const midZ = (zOuter + zInner) / 2;

        return (
          <group key={`cantilever-truss-${i}`}>
            <mesh position={[midX, 19.8, midZ]} rotation={[0, angle + Math.PI / 2, 0]}>
              <boxGeometry args={[10.6, 0.34, 0.3]} />
              <meshStandardMaterial color="#706b61" metalness={0.26} roughness={0.52} />
            </mesh>
            <mesh position={[midX + 1.2 * Math.sin(angle), 20.5, midZ + 1.2 * Math.cos(angle)]} rotation={[0, angle + Math.PI / 2, -0.12]}>
              <cylinderGeometry args={[0.035, 0.035, 10.2, 6]} />
              <meshStandardMaterial color="#E78260" metalness={0.32} roughness={0.42} />
            </mesh>
          </group>
        );
      })}

      {/* Architectural Tensile Canopy Membrane */}
      <mesh position={[0, 19.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[35.8, 46.5, 80]} />
        <meshStandardMaterial
          color="#F3EFE6"
          roughness={0.3}
          metalness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Steel Compression Rim */}
      <mesh position={[0, 19.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[46.5, 0.4, 10, 80]} />
        <meshStandardMaterial color="#706b61" metalness={0.24} roughness={0.52} />
      </mesh>

      {/* Inner Steel Tension Rim */}
      <mesh position={[0, 19.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[35.8, 0.3, 10, 80]} />
        <meshStandardMaterial color="#706b61" metalness={0.24} roughness={0.52} />
      </mesh>

      {/* A slow exterior service lift animates on the stadium shell itself; the
          bowl, camera, and pitch stay still unless the visitor moves them. */}
      <group ref={facadeLiftRef} position={[45.75, 3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2, 3.1, 1.3]} />
          <meshStandardMaterial
            color="#8fa5a5"
            transparent
            opacity={0.62}
            roughness={0.34}
            metalness={0.12}
          />
        </mesh>
        <mesh position={[0, 0, 0.67]}>
          <planeGeometry args={[1.45, 2.45]} />
          <meshStandardMaterial
            color={isNight ? '#f3d8a7' : '#c9d3cd'}
            emissive="#b45b3e"
            emissiveIntensity={isNight ? 0.34 : 0.1}
            roughness={0.38}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0, -1.63, 0]}>
          <boxGeometry args={[2.1, 0.22, 1.4]} />
          <meshStandardMaterial color="#736c60" roughness={0.62} metalness={0.18} />
        </mesh>
      </group>

      {/* =========================================================================
          6. ELECTRONIC SCOREBOARDS (Recessed cleanly to eliminate camera clipping)
          ========================================================================= */}
      {/* North End Electronic Scoreboard */}
      <group position={[0, 18.2, -44]}>
        <mesh position={[0, 0, -0.5]}>
          <boxGeometry args={[16.2, 6.8, 0.8]} />
          <meshStandardMaterial color="#49463e" metalness={0.46} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[15.6, 6.2]} />
          <meshBasicMaterial map={scoreboardTexture} />
        </mesh>
      </group>

      {/* South End Electronic Scoreboard */}
      <group position={[0, 18.2, 44]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, -0.5]}>
          <boxGeometry args={[16.2, 6.8, 0.8]} />
          <meshStandardMaterial color="#49463e" metalness={0.46} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[15.6, 6.2]} />
          <meshBasicMaterial map={scoreboardTexture} />
        </mesh>
      </group>

      {/* =========================================================================
          7. 4 HIGH-MAST FLOODLIGHT TOWERS
          ========================================================================= */}
      {[
        { x: 52, z: 52, rot: -Math.PI / 4 },
        { x: -52, z: 52, rot: Math.PI / 4 },
        { x: 52, z: -52, rot: (-3 * Math.PI) / 4 },
        { x: -52, z: -52, rot: (3 * Math.PI) / 4 }
      ].map((mast, i) => (
        <group key={`floodlight-tower-${i}`} position={[mast.x, 0, mast.z]} rotation={[0, mast.rot, 0]}>
          <mesh position={[0, 16, 0]}>
            <cylinderGeometry args={[0.65, 1.8, 32, 4]} />
          <meshStandardMaterial color="#555148" metalness={0.36} roughness={0.55} />
          </mesh>
          {/* Floodlight Head Array (Lamps) */}
          <group position={[0, 32, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[6.8, 3.2, 1.2]} />
              <meshStandardMaterial color="#46423a" metalness={0.42} roughness={0.48} />
            </mesh>
            <mesh position={[0, 0, 0.65]}>
              <planeGeometry args={[6.4, 2.8]} />
              <meshBasicMaterial color={isNight ? '#ffffff' : '#d6d0c4'} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};
