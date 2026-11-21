export type MatchFormat = 'T20' | 'ODI' | 'Test';

export type Tournament = 
  | 'ICC Men\'s Cricket World Cup'
  | 'ICC Men\'s T20 World Cup'
  | 'Indian Premier League (IPL)'
  | 'The Ashes Series'
  | 'Bilateral International Series';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  country: string;
  primaryColor: string;
  secondaryColor: string;
  flagEmoji: string;
  ranking: number;
}

export interface StadiumInfo {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  pitchType: 'Batting Friendly' | 'Pace & Bounce' | 'Spin Friendly' | 'Balanced';
  floodlights: boolean;
  builtYear: number;
}

export interface StandSection {
  id: string;
  name: string;
  tier: 'Lower' | 'Club / Luxury' | 'Upper' | 'VIP Pavilion';
  category: 'General' | 'Premium' | 'VIP' | 'Corporate Box';
  basePrice: number;
  currency: string;
  capacity: number;
  availableSeats: number;
  color: string;
  // 3D coordinates for camera target and stand placement
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  povPosition: [number, number, number];
  povTarget: [number, number, number];
  description: string;
  perks: string[];
}

export type SeatStatus = 'available' | 'selected' | 'reserved' | 'vip';

export interface Seat {
  id: string;
  standId: string;
  row: string;
  number: number;
  tier: string;
  price: number;
  status: SeatStatus;
}

export interface Match {
  id: string;
  tournament: Tournament;
  format: MatchFormat;
  matchNumber: string;
  title: string;
  teamA: Team;
  teamB: Team;
  venue: StadiumInfo;
  dateTime: string; // ISO string
  ticketStatus: 'Selling Fast' | 'Available' | 'Almost Full' | 'Sold Out';
  minPrice: number;
  currency: string;
  featured: boolean;
  matchStatus: 'Upcoming' | 'Live' | 'Completed';
  weatherForecast: string;
  pitchReport: string;
}

export interface FanAddon {
  id: string;
  name: string;
  category: 'Merchandise' | 'Food & Beverage' | 'Hospitality' | 'Parking';
  price: number;
  currency: string;
  description: string;
  icon: string;
}

export interface BookingState {
  match: Match | null;
  selectedStand: StandSection | null;
  selectedSeats: Seat[];
  selectedAddons: { addon: FanAddon; quantity: number }[];
  bookingStep: 'explore' | 'stand-select' | 'seat-select' | 'checkout' | 'confirmed';
  holdExpiresAt: number | null; // Timestamp
  bookingReference: string | null;
}

export interface UserTicket {
  bookingId: string;
  bookingReference: string;
  match: Match;
  stand: StandSection;
  seats: Seat[];
  addons: { addon: FanAddon; quantity: number }[];
  totalPaid: number;
  currency: string;
  bookedAt: string;
  qrCodeValue: string;
  gateEntrance: string;
  turnstileCode: string;
}

export type TimeOfDay = 'day' | 'golden-hour' | 'sunset' | 'night';
