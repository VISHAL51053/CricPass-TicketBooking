import type { StandSection, Seat, FanAddon } from '../types';

export interface StandSectorGeometry {
  id: string;
  angleStart: number;
  angleEnd: number;
  centerAngle: number;
  innerRadius: number;
  outerRadius: number;
  baseHeight: number;
  topHeight: number;
}

export const STADIUM_STANDS: StandSection[] = [
  {
    id: 'pavilion-terrace',
    name: 'Presidential Pavilion',
    tier: 'VIP Pavilion',
    category: 'VIP',
    basePrice: 15000,
    currency: 'INR',
    capacity: 2500,
    availableSeats: 48,
    color: '#E78260', // Terracotta
    cameraPosition: [0, 11, 34],
    cameraTarget: [0, 0.8, 0],
    povPosition: [0, 4.2, 28.5],
    povTarget: [0, 0.6, 0],
    description: 'Premier sightline directly behind the bowler’s arm at the South End. Exclusive lounge access, five-star catering, and close proximity to the player dugout.',
    perks: ['Complimentary Gourmet Buffet', 'VIP Fast-track Gate 1 Entrance', 'Dugout Walkway Line of Sight', 'Official Holographic Match Pass']
  },
  {
    id: 'north-stand',
    name: 'North Grandstand',
    tier: 'Lower',
    category: 'Premium',
    basePrice: 6500,
    currency: 'INR',
    capacity: 18000,
    availableSeats: 142,
    color: '#292929', // Electric Black
    cameraPosition: [0, 13, -36],
    cameraTarget: [0, 0.8, 0],
    povPosition: [0, 4.8, -30.5],
    povTarget: [0, 0.6, 0],
    description: 'Direct straight-on sightline behind the North End wickets. Unrivaled longitudinal perspective for swing, seam movement, and boundary sixes.',
    perks: ['Dedicated Refreshment Hub', 'Direct Gate 3 Access', 'Padded Ergonomic Seating']
  },
  {
    id: 'south-stand',
    name: 'South Grandstand',
    tier: 'Lower',
    category: 'General',
    basePrice: 3800,
    currency: 'INR',
    capacity: 19500,
    availableSeats: 380,
    color: '#292929',
    cameraPosition: [12, 12, 33],
    cameraTarget: [0, 0.8, 0],
    povPosition: [10, 4.5, 27.5],
    povTarget: [0, 0.6, 0],
    description: 'Vibrant fan atmosphere in the southern arc. Prime viewing angle for boundary catches and explosive maximum hits over long-on.',
    perks: ['Express Food Court', 'Gate 2 Entrance', 'High-Angle Replay Screen Sightline']
  },
  {
    id: 'east-stand',
    name: 'East Mid-Wicket Stand',
    tier: 'Club / Luxury',
    category: 'Premium',
    basePrice: 4800,
    currency: 'INR',
    capacity: 22000,
    availableSeats: 310,
    color: '#E78260', // Terracotta
    cameraPosition: [34, 13, 0],
    cameraTarget: [0, 0.8, 0],
    povPosition: [28.5, 5.0, 0],
    povTarget: [0, 0.6, 0],
    description: 'Electrifying atmosphere in the catchment area for explosive cover drives, pull shots, and diving boundary catches along the mid-wicket boundary.',
    perks: ['Shaded Cantilever Canopy', 'Gate 5 Fast Access', 'Merchandise Concourse Hub']
  },
  {
    id: 'west-stand',
    name: 'West Square Leg Stand',
    tier: 'Lower',
    category: 'General',
    basePrice: 3500,
    currency: 'INR',
    capacity: 24000,
    availableSeats: 520,
    color: '#292929', // Electric Black
    cameraPosition: [-34, 13, 0],
    cameraTarget: [0, 0.8, 0],
    povPosition: [-28.5, 5.0, 0],
    povTarget: [0, 0.6, 0],
    description: 'The loudest section in the colosseum! Celebrated fan drums, synchronized chants, and incredible square leg and hook shot views.',
    perks: ['Ultra-wide HD Screen Sightlines', 'Gate 7 Express Access', 'Quick Food Kiosks']
  },
  {
    id: 'corporate-suites',
    name: 'Premium Hospitality',
    tier: 'VIP Pavilion',
    category: 'Corporate Box',
    basePrice: 28000,
    currency: 'INR',
    capacity: 1200,
    availableSeats: 16,
    color: '#E78260', // Terracotta
    cameraPosition: [24, 16, 20],
    cameraTarget: [0, 0.8, 0],
    povPosition: [22, 8.2, 18],
    povTarget: [0, 0.6, 0],
    description: 'Private air-conditioned glass suites with personal butler service, fine dining, private balcony viewing, and player meet-and-greet passes.',
    perks: ['Private Valet & Escort', 'Live Chef Station', 'Personal Sommelier', 'Signed Cricket Memorabilia']
  },
  {
    id: 'general-upper',
    name: 'Upper Deck',
    tier: 'Upper',
    category: 'General',
    basePrice: 1800,
    currency: 'INR',
    capacity: 45000,
    availableSeats: 1250,
    color: '#292929', // Electric Black
    cameraPosition: [0, 30, 44],
    cameraTarget: [0, 0, 0],
    povPosition: [4, 13.8, 38],
    povTarget: [0, 0.5, 0],
    description: 'Spectacular bird\'s-eye view of the entire 360° cricket field, pitch formations, tactical field settings, and the roaring 132,000 colosseum crowd.',
    perks: ['Unobstructed 360° Field Geometry', 'Gate 9 & 10 Elevators', 'Budget-Friendly Access']
  }
];

// Physical 3D Sector Geometry Bounds in radians & metres
export const STAND_SECTORS: Record<string, StandSectorGeometry> = {
  'pavilion-terrace': {
    id: 'pavilion-terrace',
    angleStart: -Math.PI * 0.15,
    angleEnd: Math.PI * 0.15,
    centerAngle: 0,
    innerRadius: 27.2,
    outerRadius: 33.6,
    baseHeight: 0.8,
    topHeight: 4.8
  },
  'south-stand': {
    id: 'south-stand',
    angleStart: Math.PI * 0.15,
    angleEnd: Math.PI * 0.35,
    centerAngle: Math.PI * 0.25,
    innerRadius: 27.2,
    outerRadius: 33.6,
    baseHeight: 0.8,
    topHeight: 4.8
  },
  'east-stand': {
    id: 'east-stand',
    angleStart: Math.PI * 0.35,
    angleEnd: Math.PI * 0.65,
    centerAngle: Math.PI * 0.5,
    innerRadius: 27.2,
    outerRadius: 33.6,
    baseHeight: 0.8,
    topHeight: 4.8
  },
  'north-stand': {
    id: 'north-stand',
    angleStart: Math.PI * 0.85,
    angleEnd: Math.PI * 1.15,
    centerAngle: Math.PI,
    innerRadius: 27.2,
    outerRadius: 33.6,
    baseHeight: 0.8,
    topHeight: 4.8
  },
  'west-stand': {
    id: 'west-stand',
    angleStart: -Math.PI * 0.65,
    angleEnd: -Math.PI * 0.35,
    centerAngle: -Math.PI * 0.5,
    innerRadius: 27.2,
    outerRadius: 33.6,
    baseHeight: 0.8,
    topHeight: 4.8
  },
  'corporate-suites': {
    id: 'corporate-suites',
    angleStart: Math.PI * 0.15,
    angleEnd: Math.PI * 0.45,
    centerAngle: Math.PI * 0.3,
    innerRadius: 33.8,
    outerRadius: 36.8,
    baseHeight: 5.6,
    topHeight: 8.8
  },
  'general-upper': {
    id: 'general-upper',
    angleStart: -Math.PI,
    angleEnd: Math.PI,
    centerAngle: 0,
    innerRadius: 36.8,
    outerRadius: 44.5,
    baseHeight: 9.0,
    topHeight: 18.0
  }
};

export const getSeatWorldPosition = (
  standId: string,
  row: string,
  number: number
): [number, number, number] => {
  const sector = STAND_SECTORS[standId] || STAND_SECTORS['pavilion-terrace'];
  const rowIndex = Math.max(0, Math.min(5, row.charCodeAt(0) - 65)); // A=0, B=1, ...
  const colIndex = Math.max(1, Math.min(16, number)) - 1;

  // Angular spread along the sector's arc
  const angleSpan = sector.angleEnd - sector.angleStart;
  // Keep the centre aisle visible in the seat model: 8 seats on either side.
  const angleProgress = colIndex < 8
    ? 0.04 + (colIndex / 7) * 0.40
    : 0.56 + ((colIndex - 8) / 7) * 0.40;
  const angle = sector.angleStart + angleProgress * angleSpan;

  // Radial stepping up the amphitheater rake
  const radiusSpan = sector.outerRadius - sector.innerRadius;
  const rowProgress = rowIndex / 5;
  const radius = sector.innerRadius + 0.35 + rowProgress * Math.max(0, radiusSpan - 0.7);
  
  // Vertical step height
  const heightSpan = sector.topHeight - sector.baseHeight;
  const y = sector.baseHeight + 0.45 + rowProgress * Math.max(0, heightSpan - 0.75);

  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);

  return [x, y, z];
};

export const getSeatEyePosition = (
  standId: string,
  row: string,
  number: number
): [number, number, number] => {
  const [x, y, z] = getSeatWorldPosition(standId, row, number);
  // Use the selected seat's actual position, with a small natural lean toward
  // the field so the lower-bowl shell and safety rail do not occlude the view.
  const radius = Math.hypot(x, z) || 1;
  const forwardLean = 0.95;
  return [x - (x / radius) * forwardLean, y + 1.2, z - (z / radius) * forwardLean];
};

export const calculateSeatSightline = (
  standId: string,
  row: string,
  number: number
) => {
  const [x, y, z] = getSeatWorldPosition(standId, row, number);
  const pitchCenterX = 0;
  const pitchCenterY = 0.4;
  const pitchCenterZ = 0;

  // 3D Euclidean distance to pitch center
  const dx = x - pitchCenterX;
  const dy = y - pitchCenterY;
  const dz = z - pitchCenterZ;
  const distanceToPitch = Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz) * 10) / 10;

  // Elevation angle from seat to pitch (degrees)
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
  const elevationAngleRad = Math.atan2(dy, horizontalDistance);
  const elevationAngleDeg = Math.round((elevationAngleRad * 180) / Math.PI * 10) / 10;

  // Horizontal viewing bearing relative to pitch axis (degrees)
  const bearingRad = Math.atan2(dx, dz);
  const horizontalBearingDeg = Math.round((bearingRad * 180) / Math.PI);

  return {
    distanceToPitch,
    elevationAngleDeg,
    horizontalBearingDeg,
    isUnobstructed: null,
    statusLabel: 'Approximate pitch sightline · obstructions not modeled'
  };
};

export const generateStandSeats = (standId: string, basePrice: number): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 16;
  const seats: Seat[] = [];

  rows.forEach((row, rowIndex) => {
    // Front rows have higher premium pricing
    const rowMultiplier = 1 + (rows.length - 1 - rowIndex) * 0.12;
    const rowPrice = Math.round(basePrice * rowMultiplier);

    for (let i = 1; i <= seatsPerRow; i++) {
      let status: 'available' | 'reserved' | 'vip' = 'available';

      // Specific realistic reservations
      if ((i === 5 && rowIndex === 0) || (i === 12 && rowIndex === 2) || (i === 9 && rowIndex === 4)) {
        status = 'reserved';
      } else if (rowIndex === 0 && (i === 7 || i === 8)) {
        status = 'vip';
      }

      seats.push({
        id: `${standId}-${row}${i}`,
        standId,
        row,
        number: i,
        tier: rowIndex === 0 ? 'Front Row Premium' : rowIndex < 3 ? 'Mid-Bowl' : 'Upper Rake',
        price: rowPrice,
        status
      });
    }
  });

  return seats;
};

export const FAN_ADDONS: FanAddon[] = [
  {
    id: 'addon-match-programme',
    name: 'Official Tournament Programme & Hardcover Souvenir',
    category: 'Merchandise',
    price: 950,
    currency: 'INR',
    description: 'Limited edition 148-page tournament book with team dossiers, player statistics, and embossed cover.',
    icon: 'BookOpen'
  },
  {
    id: 'addon-vip-hospitality-lounge',
    name: 'Presidential Lounge Access & Five-Star Dining',
    category: 'Hospitality',
    price: 4500,
    currency: 'INR',
    description: 'Pre-match and mid-innings luxury buffet, artisan beverage service, and air-conditioned retreat.',
    icon: 'Utensils'
  },
  {
    id: 'addon-fast-track-parking',
    name: 'VIP Priority Stadium Parking (Basement P1)',
    category: 'Parking',
    price: 1200,
    currency: 'INR',
    description: 'Reserved parking spot directly adjacent to Gate 01 elevator bank with dedicated ingress & egress lane.',
    icon: 'Car'
  },
  {
    id: 'addon-team-merch-bundle',
    name: 'Official Match Day Jersey & Commemorative Cap',
    category: 'Merchandise',
    price: 2800,
    currency: 'INR',
    description: 'Authentic moisture-wicking team jersey with serialized hologram authentication tag.',
    icon: 'Shirt'
  }
];
