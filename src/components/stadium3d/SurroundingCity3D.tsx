import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TimeOfDay } from '../../types';

interface SurroundingCity3DProps {
  timeOfDay: TimeOfDay;
}

type FacadeStyle = 'glass' | 'stone' | 'brick' | 'hotel';
const FACADE_STYLES: FacadeStyle[] = ['glass', 'stone', 'brick', 'hotel'];

interface CityBuilding {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  rotation: number;
  facade: FacadeStyle;
  tint: string;
  stepped: boolean;
  landmark: boolean;
}

interface InstanceTransform {
  position: [number, number, number];
  size: [number, number, number];
  rotation: number;
  color: string;
}

const seededRandom = (initialSeed: number) => {
  let seed = initialSeed;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
};

const createCity = (): CityBuilding[] => {
  const random = seededRandom(43019);
  const landmarks = new Set(['133,-95', '-133,95', '95,133', '-95,-133', '171,19', '-171,-19']);
  const palettes: Record<FacadeStyle, string[]> = {
    glass: ['#b8c6c1', '#93aaa8', '#8ba0a2', '#c2c9bd'],
    stone: ['#d2c3aa', '#b5a68f', '#c8b89d', '#d8cbb7'],
    brick: ['#ba8063', '#a96f57', '#cb9271', '#9f705a'],
    hotel: ['#d2c4ad', '#b7a68b', '#c8b79f', '#9d9a8b']
  };
  const buildings: CityBuilding[] = [];

  // Ten by ten real street parcels. The inner 90 m stays open as the stadium park.
  for (let z = -171; z <= 171; z += 38) {
    for (let x = -171; x <= 171; x += 38) {
      const radius = Math.hypot(x, z);
      if (radius < 91 || radius > 246) continue;

      const landmark = landmarks.has(`${x},${z}`);
      // Leave occasional open plots for pocket parks and sight lines.
      if (!landmark && random() > (radius < 125 ? 0.93 : 0.96)) continue;

      const styleDraw = random();
      const facade: FacadeStyle = styleDraw < 0.37
        ? 'glass'
        : styleDraw < 0.64
          ? 'stone'
          : styleDraw < 0.83
            ? 'brick'
            : 'hotel';
      const height = landmark
        ? 62 + random() * 16
        : radius < 125
          ? 19 + random() * 17
          : 23 + random() * 30 + (facade === 'glass' && random() > 0.72 ? 11 : 0);

      buildings.push({
        x,
        z,
        width: landmark ? 20 + random() * 5 : 20 + random() * 9,
        depth: landmark ? 19 + random() * 5 : 18 + random() * 9,
        height,
        rotation: random() > 0.86 ? Math.PI / 2 : 0,
        facade,
        tint: palettes[facade][Math.floor(random() * palettes[facade].length)],
        stepped: landmark || (height > 32 && random() > 0.48),
        landmark
      });
    }
  }

  return buildings;
};

const createFacadeTextures = (style: FacadeStyle) => {
  const random = seededRandom(7021 + FACADE_STYLES.indexOf(style) * 271);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  const emissiveCanvas = document.createElement('canvas');
  emissiveCanvas.width = 512;
  emissiveCanvas.height = 1024;
  const emissive = emissiveCanvas.getContext('2d')!;

  const baseColors: Record<FacadeStyle, [string, string]> = {
    glass: ['#3d565c', '#a6b5ad'],
    stone: ['#827766', '#c9bca6'],
    brick: ['#775345', '#b57c62'],
    hotel: ['#756b5b', '#c2b59f']
  };
  const [topColor, lowerColor] = baseColors[style];
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(0.65, lowerColor);
  gradient.addColorStop(1, topColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  emissive.fillStyle = '#000000';
  emissive.fillRect(0, 0, canvas.width, canvas.height);

  const rows = style === 'hotel' ? 21 : 25;
  const columns = style === 'brick' ? 9 : 10;
  const bayWidth = canvas.width / columns;
  const bayHeight = canvas.height / rows;
  const paneColors = style === 'glass'
    ? ['#617d80', '#769092', '#536e74', '#91a7a2']
    : ['#3f5356', '#536467', '#685f50', '#667575'];

  for (let row = 0; row < rows; row++) {
    const y = row * bayHeight;
    for (let col = 0; col < columns; col++) {
      const x = col * bayWidth;
      const inset = style === 'hotel' ? 7 : 5;
      const paneX = x + inset;
      const paneY = y + 5;
      const paneW = bayWidth - inset * 2;
      const paneH = bayHeight - (style === 'hotel' ? 12 : 10);

      ctx.fillStyle = style === 'brick' ? '#d0a184' : style === 'glass' ? '#9baea6' : '#d4c5ac';
      ctx.fillRect(x, y + bayHeight - 3, bayWidth - 1, 3);
      if (style === 'hotel') {
        ctx.fillStyle = '#807869';
        ctx.fillRect(paneX - 2, paneY - 3, paneW + 4, paneH + 6);
      }
      ctx.fillStyle = paneColors[Math.floor(random() * paneColors.length)];
      ctx.fillRect(paneX, paneY, paneW, paneH);

      if (style === 'glass' || style === 'hotel') {
        ctx.fillStyle = 'rgba(232, 239, 229, 0.24)';
        ctx.fillRect(paneX + 2, paneY + 1, Math.max(2, paneW * 0.12), paneH - 2);
      }
      if (style === 'stone' || style === 'hotel') {
        ctx.fillStyle = style === 'hotel' ? '#b58765' : '#968872';
        ctx.fillRect(paneX - 3, paneY + paneH, paneW + 6, 2);
      }

      if (random() > 0.9) {
        emissive.fillStyle = style === 'hotel' ? '#ffd39b' : '#f1c281';
        emissive.fillRect(paneX + 1, paneY + 1, Math.max(2, paneW - 2), Math.max(2, paneH - 2));
      }
    }
  }

  // Deep vertical piers make the height and bay rhythm legible from the aerial view.
  if (style !== 'brick') {
    ctx.fillStyle = style === 'glass' ? 'rgba(208, 220, 210, .62)' : 'rgba(224, 209, 184, .72)';
    for (let x = 0; x < canvas.width; x += 128) ctx.fillRect(x, 0, 4, canvas.height);
  }

  const colorTexture = new THREE.CanvasTexture(canvas);
  colorTexture.colorSpace = THREE.SRGBColorSpace;
  colorTexture.anisotropy = 4;
  const emissiveTexture = new THREE.CanvasTexture(emissiveCanvas);
  emissiveTexture.colorSpace = THREE.SRGBColorSpace;
  emissiveTexture.anisotropy = 4;
  return { colorTexture, emissiveTexture };
};

const createGroundTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const random = seededRandom(412);
  ctx.fillStyle = '#8d8676';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 1300; i++) {
    const light = random() > 0.5;
    ctx.fillStyle = light ? 'rgba(218, 204, 177, 0.17)' : 'rgba(64, 65, 58, 0.13)';
    const size = 1 + random() * 3;
    ctx.fillRect(random() * 256, random() * 256, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(145, 145);
  texture.anisotropy = 4;
  return texture;
};

const createRoadNetwork = () => {
  const roads: Array<[number, number, number, number]> = [];
  const sidewalks: Array<[number, number, number, number]> = [];
  const markings: Array<[number, number, number, number]> = [];
  const boundary = 72;
  const extent = 270;
  const roadWidth = 8.4;
  const sidewalkWidth = 1.8;

  const addStreet = (center: number, vertical: boolean) => {
    const gap = Math.abs(center) < boundary ? Math.sqrt(boundary * boundary - center * center) + 1.4 : 0;
    const segments: Array<[number, number]> = gap > 0
      ? [[-extent, -gap], [gap, extent]]
      : [[-extent, extent]];

    segments.forEach(([start, end]) => {
      if (end - start < 3) return;
      roads.push(vertical
        ? [center, (start + end) / 2, roadWidth, end - start]
        : [(start + end) / 2, center, end - start, roadWidth]);
      for (const side of [-1, 1]) {
        sidewalks.push(vertical
          ? [center + side * (roadWidth / 2 + sidewalkWidth / 2), (start + end) / 2, sidewalkWidth, end - start]
          : [(start + end) / 2, center + side * (roadWidth / 2 + sidewalkWidth / 2), end - start, sidewalkWidth]);
      }

      for (let mark = Math.ceil((start + 8) / 21) * 21; mark < end - 5; mark += 21) {
        if (Math.hypot(center, mark) < boundary + 6) continue;
        markings.push(vertical
          ? [center, mark, 0.16, 5.2]
          : [mark, center, 5.2, 0.16]);
      }
    });
  };

  for (let coordinate = -190; coordinate <= 190; coordinate += 38) {
    addStreet(coordinate, true);
    addStreet(coordinate, false);
  }

  return { roads, sidewalks, markings };
};

const buildSurfaceGeometry = (rectangles: Array<[number, number, number, number]>, y: number) => {
  const positions: number[] = [];
  const indices: number[] = [];
  rectangles.forEach(([x, z, width, depth], index) => {
    const left = x - width / 2;
    const right = x + width / 2;
    const near = z - depth / 2;
    const far = z + depth / 2;
    const offset = index * 4;
    positions.push(left, y, near, left, y, far, right, y, far, right, y, near);
    indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

const makeInstance = (
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  depth: number,
  rotation: number,
  color: string
): InstanceTransform => ({
  position: [x, y, z],
  size: [width, height, depth],
  rotation,
  color
});

const writeInstanceMatrix = (
  target: THREE.InstancedMesh,
  index: number,
  transform: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  yaw: number,
  size: [number, number, number]
) => {
  transform.position.set(x, y, z);
  transform.rotation.set(0, yaw, 0);
  transform.scale.set(...size);
  transform.updateMatrix();
  target.setMatrixAt(index, transform.matrix);
};

const BuildingLayer: React.FC<{
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  entries: InstanceTransform[];
  castShadow?: boolean;
}> = ({ geometry, material, entries, castShadow = false }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const transform = useMemo(() => new THREE.Object3D(), []);
  const tint = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    const instanceMesh = mesh.current;
    if (!instanceMesh) return;
    entries.forEach((entry, index) => {
      transform.position.set(...entry.position);
      transform.rotation.set(0, entry.rotation, 0);
      transform.scale.set(...entry.size);
      transform.updateMatrix();
      instanceMesh.setMatrixAt(index, transform.matrix);
      tint.set(entry.color);
      instanceMesh.setColorAt(index, tint);
    });
    instanceMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    instanceMesh.instanceMatrix.needsUpdate = true;
    if (instanceMesh.instanceColor) instanceMesh.instanceColor.needsUpdate = true;
    instanceMesh.computeBoundingSphere();
  }, [entries, transform, tint]);

  if (!entries.length) return null;
  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, entries.length]}
      castShadow={castShadow}
      receiveShadow
    />
  );
};

const useReducedMotionPreference = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
};

const CityTraffic: React.FC<{
  boxGeometry: THREE.BufferGeometry;
  animated: boolean;
  isNight: boolean;
}> = ({ boxGeometry, animated, isNight }) => {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const roofRef = useRef<THREE.InstancedMesh>(null);
  const headlampRef = useRef<THREE.InstancedMesh>(null);
  const tailLampRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const headlights = useMemo(() => new THREE.Vector3(), []);
  const tailLights = useMemo(() => new THREE.Vector3(), []);
  const vehicles = useMemo(() => {
    const cars: Array<{ route: 'ring' | 'spoke'; phase: number; direction: number; radius: number; axis: 'x' | 'z'; lane: number; color: string }> = [];
    const colors = ['#d4c7ae', '#a66e52', '#65766c', '#b7b8b0', '#6d7f85', '#d1a86e', '#bfc3bb'];
    for (let laneIndex = 0; laneIndex < 2; laneIndex++) {
      for (let slot = 0; slot < 6; slot++) {
        cars.push({
          route: 'ring',
          phase: (slot / 6) * Math.PI * 2 + laneIndex * Math.PI / 6,
          direction: laneIndex === 0 ? 1 : -1,
          radius: laneIndex === 0 ? 76 : 80.2,
          axis: 'x',
          lane: 0,
          color: colors[(slot + laneIndex * 2) % colors.length]
        });
      }
    }
    const spokes: Array<['x' | 'z', number, number]> = [
      ['x', 1, -1.4], ['x', -1, 1.4], ['z', 1, 1.4], ['z', -1, -1.4],
      ['x', 1, 1.4], ['x', -1, -1.4], ['z', 1, -1.4], ['z', -1, 1.4]
    ];
    spokes.forEach(([axis, direction, lane], i) => {
      cars.push({ route: 'spoke', phase: (i % 4) / 4, direction, radius: 0, axis, lane, color: colors[(i + 2) % colors.length] });
    });
    return cars;
  }, []);
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.42, metalness: 0.24 }), []);
  const roofMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#303a3c', roughness: 0.33, metalness: 0.36 }), []);
  const headlampMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: isNight ? '#ffe4ab' : '#f1dfbc' }), [isNight]);
  const tailLampMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#a53e31' }), []);
  const colorScratch = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    vehicles.forEach((vehicle, index) => {
      colorScratch.set(vehicle.color);
      body.setColorAt(index, colorScratch);
    });
    if (body.instanceColor) body.instanceColor.needsUpdate = true;
  }, [vehicles, colorScratch]);

  useEffect(() => () => {
    bodyMaterial.dispose();
    roofMaterial.dispose();
    headlampMaterial.dispose();
    tailLampMaterial.dispose();
  }, [bodyMaterial, roofMaterial, headlampMaterial, tailLampMaterial]);

  useFrame(({ clock }) => {
    const body = bodyRef.current;
    const roof = roofRef.current;
    const lamps = headlampRef.current;
    const tails = tailLampRef.current;
    if (!body || !roof || !lamps || !tails) return;
    const elapsed = animated ? clock.getElapsedTime() : 0;
    vehicles.forEach((vehicle, index) => {
      let x: number;
      let z: number;
      let yaw: number;
      if (vehicle.route === 'ring') {
        const angle = vehicle.phase + vehicle.direction * elapsed * 0.075;
        x = vehicle.radius * Math.sin(angle);
        z = vehicle.radius * Math.cos(angle);
        yaw = angle + vehicle.direction * Math.PI / 2;
      } else {
        const routeLength = 122;
        const routeProgress = vehicle.phase * routeLength + elapsed * 5.2 * vehicle.direction + 240;
        // JavaScript's remainder can be negative. Normalize it so reversing
        // traffic wraps at the outer road instead of crossing the stadium.
        const distance = 88 + ((routeProgress % routeLength) + routeLength) % routeLength;
        const signedDistance = vehicle.direction * distance;
        x = vehicle.axis === 'x' ? signedDistance : vehicle.lane;
        z = vehicle.axis === 'z' ? signedDistance : vehicle.lane;
        yaw = vehicle.axis === 'x'
          ? vehicle.direction * Math.PI / 2
          : vehicle.direction < 0 ? Math.PI : 0;
      }

      writeInstanceMatrix(body, index, dummy, x, 0.5, z, yaw, [1.85, 0.58, 3.2]);
      writeInstanceMatrix(roof, index, dummy, x - Math.sin(yaw) * 0.12, 0.91, z - Math.cos(yaw) * 0.12, yaw, [1.34, 0.48, 1.62]);
      headlights.set(x + Math.sin(yaw) * 1.42, 0.56, z + Math.cos(yaw) * 1.42);
      writeInstanceMatrix(lamps, index * 2, dummy, headlights.x + Math.cos(yaw) * 0.48, headlights.y, headlights.z - Math.sin(yaw) * 0.48, yaw, [0.22, 0.16, 0.12]);
      writeInstanceMatrix(lamps, index * 2 + 1, dummy, headlights.x - Math.cos(yaw) * 0.48, headlights.y, headlights.z + Math.sin(yaw) * 0.48, yaw, [0.22, 0.16, 0.12]);
      tailLights.set(x - Math.sin(yaw) * 1.42, 0.55, z - Math.cos(yaw) * 1.42);
      writeInstanceMatrix(tails, index * 2, dummy, tailLights.x + Math.cos(yaw) * 0.48, tailLights.y, tailLights.z - Math.sin(yaw) * 0.48, yaw, [0.22, 0.14, 0.12]);
      writeInstanceMatrix(tails, index * 2 + 1, dummy, tailLights.x - Math.cos(yaw) * 0.48, tailLights.y, tailLights.z + Math.sin(yaw) * 0.48, yaw, [0.22, 0.14, 0.12]);
    });
    body.instanceMatrix.needsUpdate = true;
    roof.instanceMatrix.needsUpdate = true;
    lamps.instanceMatrix.needsUpdate = true;
    tails.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={bodyRef} args={[boxGeometry, bodyMaterial, vehicles.length]} castShadow />
      <instancedMesh ref={roofRef} args={[boxGeometry, roofMaterial, vehicles.length]} />
      <instancedMesh ref={headlampRef} args={[boxGeometry, headlampMaterial, vehicles.length * 2]} />
      <instancedMesh ref={tailLampRef} args={[boxGeometry, tailLampMaterial, vehicles.length * 2]} />
    </>
  );
};

const SkylineLift: React.FC<{ building: CityBuilding; animated: boolean; isNight: boolean }> = ({ building, animated, isNight }) => {
  const cabin = useRef<THREE.Group>(null);
  const liftHeight = building.height;
  const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9da9a5', metalness: 0.54, roughness: 0.38 }), []);
  const cabinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#b7d0c5',
    metalness: 0.28,
    roughness: 0.3,
    emissive: '#df9864',
    emissiveIntensity: isNight ? 0.58 : 0.11
  }), [isNight]);

  useFrame(({ clock }) => {
    if (!cabin.current || !animated) return;
    const phase = (clock.getElapsedTime() * 0.04) % 2;
    const progress = phase <= 1 ? phase : 2 - phase;
    cabin.current.position.y = 4 + progress * (liftHeight - 8);
  });

  useEffect(() => () => {
    frameMaterial.dispose();
    cabinMaterial.dispose();
  }, [frameMaterial, cabinMaterial]);

  return (
    <group
      position={[building.x + building.width / 2 + 0.24, 0, building.z + building.depth / 2 + 0.42]}
      rotation={[0, building.rotation, 0]}
    >
      <mesh position={[-1.15, liftHeight / 2, 0]} material={frameMaterial}>
        <boxGeometry args={[0.13, liftHeight, 0.13]} />
      </mesh>
      <mesh position={[1.15, liftHeight / 2, 0]} material={frameMaterial}>
        <boxGeometry args={[0.13, liftHeight, 0.13]} />
      </mesh>
      <group ref={cabin} position={[0, 4, 0.18]}>
        <mesh material={cabinMaterial} castShadow>
          <boxGeometry args={[2.1, 1.8, 0.34]} />
        </mesh>
        <mesh position={[0, 0, 0.19]}>
          <boxGeometry args={[1.72, 1.38, 0.05]} />
          <meshBasicMaterial color={isNight ? '#f9d7a2' : '#9fbcb7'} transparent opacity={0.78} />
        </mesh>
      </group>
    </group>
  );
};

export const SurroundingCity3D: React.FC<SurroundingCity3DProps> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden-hour' || timeOfDay === 'sunset';
  const prefersReducedMotion = useReducedMotionPreference();
  const buildings = useMemo(() => createCity(), []);
  const groundTexture = useMemo(() => createGroundTexture(), []);
  const roadNetwork = useMemo(() => createRoadNetwork(), []);
  const roadGeometry = useMemo(() => buildSurfaceGeometry(roadNetwork.roads, 0.028), [roadNetwork]);
  const sidewalkGeometry = useMemo(() => buildSurfaceGeometry(roadNetwork.sidewalks, 0.033), [roadNetwork]);
  const markingGeometry = useMemo(() => buildSurfaceGeometry(roadNetwork.markings, 0.043), [roadNetwork]);
  const ringRoadGeometry = useMemo(() => new THREE.RingGeometry(73.6, 82.4, 192), []);
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const trees = useMemo(() => {
    const random = seededRandom(239);
    const entries: Array<{ trunk: InstanceTransform; crown: InstanceTransform }> = [];
    for (let i = 0; i < 44; i++) {
      const angle = (i / 44) * Math.PI * 2;
      const radius = i % 2 ? 78.5 : 71.7;
      const x = radius * Math.sin(angle);
      const z = radius * Math.cos(angle);
      const height = 4.4 + random() * 1.2;
      const tint = random() > 0.5 ? '#536f43' : '#657a4a';
      entries.push({
        trunk: makeInstance(x, 1.65, z, 0.44, 3.3, 0.44, angle, '#70573d'),
        crown: makeInstance(x, height, z, 3.1, 3.1, 3.1, angle, tint)
      });
    }
    return entries;
  }, []);
  const landscapeEntries = useMemo(() => ({
    trunks: trees.map((tree) => tree.trunk),
    crowns: trees.map((tree) => tree.crown)
  }), [trees]);
  const trunkGeometry = useMemo(() => new THREE.CylinderGeometry(0.22, 0.3, 3.3, 7), []);
  const crownGeometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const trunkMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#765d42', roughness: 0.93 }), []);
  const crownMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.93 }), []);
  const facadeAssets = useMemo(() => Object.fromEntries(
    FACADE_STYLES.map((style) => [style, createFacadeTextures(style)])
  ) as Record<FacadeStyle, ReturnType<typeof createFacadeTextures>>, []);
  const facadeMaterials = useMemo(() => Object.fromEntries(
    FACADE_STYLES.map((style) => [style, new THREE.MeshStandardMaterial({
      map: facadeAssets[style].colorTexture,
      emissiveMap: facadeAssets[style].emissiveTexture,
      emissive: '#ffd0a0',
      emissiveIntensity: 0,
      roughness: style === 'glass' ? 0.38 : style === 'brick' ? 0.84 : 0.7,
      metalness: style === 'glass' ? 0.22 : 0.04
    })])
  ) as Record<FacadeStyle, THREE.MeshStandardMaterial>, [facadeAssets]);
  const plinthMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.78 }), []);
  const roofMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.68 }), []);
  const finMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.56, metalness: 0.16 }), []);
  const antennaMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b68661', roughness: 0.42, metalness: 0.35 }), []);
  const finGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const antennaGeometry = useMemo(() => new THREE.CylinderGeometry(0.18, 0.32, 1, 6), []);
  const cityLayers = useMemo(() => {
    const bodies: Record<FacadeStyle, InstanceTransform[]> = { glass: [], stone: [], brick: [], hotel: [] };
    const upper: Record<FacadeStyle, InstanceTransform[]> = { glass: [], stone: [], brick: [], hotel: [] };
    const plinths: InstanceTransform[] = [];
    const roofBands: InstanceTransform[] = [];
    const fins: InstanceTransform[] = [];
    const antennas: InstanceTransform[] = [];
    const finColors: Record<FacadeStyle, string> = {
      glass: '#c0cbc3', stone: '#e0d2b9', brick: '#956b55', hotel: '#d7c6a9'
    };

    buildings.forEach((building) => {
      const bodyHeight = building.stepped ? building.height * 0.76 : building.height;
      bodies[building.facade].push(makeInstance(
        building.x, bodyHeight / 2, building.z,
        building.width, bodyHeight, building.depth,
        building.rotation, building.tint
      ));
      if (building.stepped) {
        const upperHeight = building.height * 0.25;
        upper[building.facade].push(makeInstance(
          building.x, bodyHeight + upperHeight / 2, building.z,
          building.width * 0.72, upperHeight, building.depth * 0.72,
          building.rotation, building.tint
        ));
      }
      plinths.push(makeInstance(
        building.x, 1.12, building.z,
        building.width + 1.2, 2.24, building.depth + 1.2,
        building.rotation, finColors[building.facade]
      ));
      roofBands.push(makeInstance(
        building.x, building.height - 0.1, building.z,
        building.width + 0.55, 0.45, building.depth + 0.55,
        building.rotation, building.facade === 'brick' ? '#9d6f56' : '#d6c9b2'
      ));

      const finHeight = building.height - 0.8;
      for (const sideX of [-1, 1]) {
        for (const sideZ of [-1, 1]) {
          const localX = sideX * (building.width / 2 - 0.15);
          const localZ = sideZ * (building.depth / 2 - 0.15);
          const rotatedX = building.x + localX * Math.cos(building.rotation) + localZ * Math.sin(building.rotation);
          const rotatedZ = building.z - localX * Math.sin(building.rotation) + localZ * Math.cos(building.rotation);
          fins.push(makeInstance(
            rotatedX, building.height / 2, rotatedZ,
            0.3, finHeight, 0.28,
            building.rotation, finColors[building.facade]
          ));
        }
      }
      if (building.landmark) {
        antennas.push(makeInstance(
          building.x, building.height + 2.4, building.z,
          0.5, 4.8, 0.5, building.rotation, '#b68661'
        ));
      }
    });

    return { bodies, upper, plinths, roofBands, fins, antennas };
  }, [buildings]);

  useEffect(() => {
    const glow = isNight ? 0.82 : isGolden ? 0.12 : 0.015;
    FACADE_STYLES.forEach((style) => {
      facadeMaterials[style].emissiveIntensity = glow;
      facadeMaterials[style].color.set(isNight ? '#aeb7b3' : '#ffffff');
    });
  }, [facadeMaterials, isGolden, isNight]);

  useEffect(() => () => {
    groundTexture.dispose();
    Object.values(facadeAssets).forEach(({ colorTexture, emissiveTexture }) => {
      colorTexture.dispose();
      emissiveTexture.dispose();
    });
    Object.values(facadeMaterials).forEach((material) => material.dispose());
    [plinthMaterial, roofMaterial, finMaterial, antennaMaterial, trunkMaterial, crownMaterial].forEach((material) => material.dispose());
    [roadGeometry, sidewalkGeometry, markingGeometry, ringRoadGeometry, boxGeometry, trunkGeometry, crownGeometry, finGeometry, antennaGeometry].forEach((geometry) => geometry.dispose());
  }, [
    groundTexture, facadeAssets, facadeMaterials, plinthMaterial, roofMaterial,
    finMaterial, antennaMaterial, trunkMaterial, crownMaterial, roadGeometry, sidewalkGeometry, markingGeometry, ringRoadGeometry,
    boxGeometry, trunkGeometry, crownGeometry, finGeometry, antennaGeometry
  ]);

  const isSunset = timeOfDay === 'sunset';
  const buildingGround = isNight ? '#4e554f' : isSunset ? '#887967' : '#958b77';
  const parkColor = isNight ? '#384438' : '#77805a';
  const roadColor = isNight ? '#303a3c' : '#454b48';
  const sidewalkColor = isNight ? '#777467' : '#b5aa93';
  const markingColor = isNight ? '#c2b896' : '#d9cfb7';
  return (
    <group>
      {/* A textured, warm urban ground keeps distant city blocks visible. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.055, 0]} receiveShadow>
        <circleGeometry args={[282, 144]} />
        <meshStandardMaterial map={groundTexture} color={buildingGround} roughness={0.96} metalness={0.01} />
      </mesh>

      {/* The arena opens into a landscaped civic park before the city streets begin. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[62.4, 70, 128]} />
        <meshStandardMaterial color={isNight ? '#656052' : '#c2b69e'} roughness={0.87} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <ringGeometry args={[70, 85, 128]} />
        <meshStandardMaterial color={parkColor} roughness={0.98} />
      </mesh>
      <mesh geometry={ringRoadGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]} receiveShadow>
        <meshStandardMaterial color={roadColor} roughness={0.9} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
        <ringGeometry args={[84.7, 85.2, 128]} />
        <meshBasicMaterial color="#b47a5c" />
      </mesh>

      {/* Connected, gridded boulevards and sidewalks make this read as a city, not a tower ring. */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial color={roadColor} roughness={0.9} metalness={0.04} />
      </mesh>
      <mesh geometry={sidewalkGeometry} receiveShadow>
        <meshStandardMaterial color={sidewalkColor} roughness={0.88} />
      </mesh>
      <mesh geometry={markingGeometry}>
        <meshBasicMaterial color={markingColor} />
      </mesh>

      {/* Tree-lined public space at the foot of the stadium. */}
      <BuildingLayer geometry={trunkGeometry} material={trunkMaterial} entries={landscapeEntries.trunks} />
      <BuildingLayer geometry={crownGeometry} material={crownMaterial} entries={landscapeEntries.crowns} />

      {/* Distinct residential, civic, hotel and glass profiles share batched geometry. */}
      {FACADE_STYLES.map((style) => (
        <React.Fragment key={style}>
          <BuildingLayer geometry={boxGeometry} material={facadeMaterials[style]} entries={cityLayers.bodies[style]} castShadow />
          <BuildingLayer geometry={boxGeometry} material={facadeMaterials[style]} entries={cityLayers.upper[style]} castShadow />
        </React.Fragment>
      ))}
      <BuildingLayer geometry={boxGeometry} material={plinthMaterial} entries={cityLayers.plinths} />
      <BuildingLayer geometry={boxGeometry} material={roofMaterial} entries={cityLayers.roofBands} />
      <BuildingLayer geometry={finGeometry} material={finMaterial} entries={cityLayers.fins} />
      <BuildingLayer geometry={antennaGeometry} material={antennaMaterial} entries={cityLayers.antennas} />

      {/* Two-way traffic stays on the outer ring road and the approach streets. */}
      <CityTraffic boxGeometry={boxGeometry} animated={!prefersReducedMotion} isNight={isNight} />

      {/* A slow exterior lift gives the tallest towers one readable, architectural motion. */}
      {buildings.filter((building) => building.landmark).slice(0, 2).map((building) => (
        <SkylineLift
          key={`lift-${building.x}-${building.z}`}
          building={building}
          animated={!prefersReducedMotion}
          isNight={isNight}
        />
      ))}
    </group>
  );
};
