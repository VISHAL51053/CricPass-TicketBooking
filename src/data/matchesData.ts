import type { Match, Team, StadiumInfo } from '../types';

export const TEAMS: Record<string, Team> = {
  IND: {
    id: 'IND',
    name: 'India',
    shortName: 'IND',
    country: 'India',
    primaryColor: '#0078FF',
    secondaryColor: '#FF671F',
    flagEmoji: '🇮🇳',
    ranking: 1
  },
  AUS: {
    id: 'AUS',
    name: 'Australia',
    shortName: 'AUS',
    country: 'Australia',
    primaryColor: '#FFD700',
    secondaryColor: '#006400',
    flagEmoji: '🇦🇺',
    ranking: 2
  },
  PAK: {
    id: 'PAK',
    name: 'Pakistan',
    shortName: 'PAK',
    country: 'Pakistan',
    primaryColor: '#01411C',
    secondaryColor: '#FFFFFF',
    flagEmoji: '🇵🇰',
    ranking: 4
  },
  ENG: {
    id: 'ENG',
    name: 'England',
    shortName: 'ENG',
    country: 'England',
    primaryColor: '#00247D',
    secondaryColor: '#CF142B',
    flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    ranking: 3
  },
  SA: {
    id: 'SA',
    name: 'South Africa',
    shortName: 'SA',
    country: 'South Africa',
    primaryColor: '#007749',
    secondaryColor: '#FFB612',
    flagEmoji: '🇿🇦',
    ranking: 5
  },
  NZ: {
    id: 'NZ',
    name: 'New Zealand',
    shortName: 'NZ',
    country: 'New Zealand',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    flagEmoji: '🇳🇿',
    ranking: 6
  },
  CSK: {
    id: 'CSK',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    country: 'India',
    primaryColor: '#FDB913',
    secondaryColor: '#0054A5',
    flagEmoji: '🦁',
    ranking: 1
  },
  MI: {
    id: 'MI',
    name: 'Mumbai Indians',
    shortName: 'MI',
    country: 'India',
    primaryColor: '#004BA0',
    secondaryColor: '#D1AB3E',
    flagEmoji: '⚡',
    ranking: 2
  }
};

export const STADIUMS: Record<string, StadiumInfo> = {
  NMS: {
    id: 'NMS',
    name: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    country: 'India',
    capacity: 132000,
    pitchType: 'Balanced',
    floodlights: true,
    builtYear: 2020
  },
  LORDS: {
    id: 'LORDS',
    name: 'Lord\'s Cricket Ground',
    city: 'London',
    country: 'United Kingdom',
    capacity: 31100,
    pitchType: 'Pace & Bounce',
    floodlights: true,
    builtYear: 1814
  },
  MCG: {
    id: 'MCG',
    name: 'Melbourne Cricket Ground',
    city: 'Melbourne',
    country: 'Australia',
    capacity: 100024,
    pitchType: 'Batting Friendly',
    floodlights: true,
    builtYear: 1853
  },
  WANKHEDE: {
    id: 'WANKHEDE',
    name: 'Wankhede Stadium',
    city: 'Mumbai',
    country: 'India',
    capacity: 33108,
    pitchType: 'Batting Friendly',
    floodlights: true,
    builtYear: 1974
  }
};

export const MATCHES_DATA: Match[] = [
  {
    id: 'match-wc-final',
    tournament: 'ICC Men\'s Cricket World Cup',
    format: 'ODI',
    matchNumber: 'Grand Final',
    title: 'ICC Men\'s World Cup Final 2026',
    teamA: TEAMS.IND,
    teamB: TEAMS.AUS,
    venue: STADIUMS.NMS,
    dateTime: '2026-11-28T14:00:00+05:30',
    ticketStatus: 'Selling Fast',
    minPrice: 1800,
    currency: 'INR',
    featured: true,
    matchStatus: 'Upcoming',
    weatherForecast: '26°C Clear Skies, 42% Humidity, No Rain Predicted',
    pitchReport: 'Red & Black soil mixture. True bounce in first innings; lights will quicken outfield under night conditions.'
  },
  {
    id: 'match-ind-pak',
    tournament: 'ICC Men\'s T20 World Cup',
    format: 'T20',
    matchNumber: 'Super 8 Clash',
    title: 'Blockbuster Rivalry: India vs Pakistan',
    teamA: TEAMS.IND,
    teamB: TEAMS.PAK,
    venue: STADIUMS.NMS,
    dateTime: '2026-12-05T19:30:00+05:30',
    ticketStatus: 'Almost Full',
    minPrice: 2500,
    currency: 'INR',
    featured: true,
    matchStatus: 'Upcoming',
    weatherForecast: '23°C Crisp Evening, High Atmosphere, Wind 12km/h SE',
    pitchReport: 'Hard-pressed belter surface offering high carry. 200+ runs expected.'
  },
  {
    id: 'match-eng-sa',
    tournament: 'ICC Men\'s Cricket World Cup',
    format: 'ODI',
    matchNumber: 'Semi-Final 1',
    title: 'World Cup Semi-Final: England vs South Africa',
    teamA: TEAMS.ENG,
    teamB: TEAMS.SA,
    venue: STADIUMS.LORDS,
    dateTime: '2026-12-10T13:30:00+00:00',
    ticketStatus: 'Available',
    minPrice: 4200,
    currency: 'INR',
    featured: false,
    matchStatus: 'Upcoming',
    weatherForecast: '17°C Overcast, High seam probability early on',
    pitchReport: 'Traditional Lord\'s slope with live green grass. Fast bowlers delight.'
  },
  {
    id: 'match-ipl-final',
    tournament: 'Indian Premier League (IPL)',
    format: 'T20',
    matchNumber: 'Final Match',
    title: 'IPL El Clásico: CSK vs MI',
    teamA: TEAMS.CSK,
    teamB: TEAMS.MI,
    venue: STADIUMS.WANKHEDE,
    dateTime: '2026-12-18T19:30:00+05:30',
    ticketStatus: 'Selling Fast',
    minPrice: 1500,
    currency: 'INR',
    featured: true,
    matchStatus: 'Upcoming',
    weatherForecast: '29°C Coastal Sea Breeze, Dew factor post 8:30 PM',
    pitchReport: 'Red soil pitch with short square boundaries. Power-hitters paradise.'
  },
  {
    id: 'match-ashes-day1',
    tournament: 'The Ashes Series',
    format: 'Test',
    matchNumber: 'Boxing Day Test - Day 1',
    title: 'The Ashes: Australia vs England',
    teamA: TEAMS.AUS,
    teamB: TEAMS.ENG,
    venue: STADIUMS.MCG,
    dateTime: '2026-12-26T10:30:00+11:00',
    ticketStatus: 'Available',
    minPrice: 2200,
    currency: 'INR',
    featured: false,
    matchStatus: 'Upcoming',
    weatherForecast: '24°C Sunny Summer Morning, Mild Breeze',
    pitchReport: 'Drop-in pitch with consistent bounce. Good batting track for days 1-3.'
  },
  {
    id: 'match-ind-nz',
    tournament: 'Bilateral International Series',
    format: 'T20',
    matchNumber: '3rd T20I Decider',
    title: 'Series Decider: India vs New Zealand',
    teamA: TEAMS.IND,
    teamB: TEAMS.NZ,
    venue: STADIUMS.NMS,
    dateTime: '2027-01-08T19:00:00+05:30',
    ticketStatus: 'Available',
    minPrice: 1200,
    currency: 'INR',
    featured: false,
    matchStatus: 'Upcoming',
    weatherForecast: '20°C Mild Winter Evening',
    pitchReport: 'Fresh track with fast outfield and good bounce.'
  }
];
