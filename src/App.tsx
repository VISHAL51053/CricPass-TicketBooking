import { useState } from 'react';
import './App.css';
import type { Match, StandSection, Seat, FanAddon, UserTicket } from './types';
import { MATCHES_DATA } from './data/matchesData';
import { STADIUM_STANDS } from './data/stadiumConfig';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { FeaturedMatchBookingShowcase } from './components/home/FeaturedMatchBookingShowcase';
import { UpcomingMatchesRibbon } from './components/home/UpcomingMatchesRibbon';
import { FullScreenStadiumExperience } from './components/stadium3d/FullScreenStadiumExperience';
import { StadiumTourExperience } from './components/stadium3d/StadiumTourExperience';
import { CheckoutPaymentModal } from './components/booking/CheckoutPaymentModal';
import { BookingSuccessTicket } from './components/booking/BookingSuccessTicket';
import { MatchDiscoveryView } from './components/matches/MatchDiscoveryView';
import { MatchDetailsModal } from './components/matches/MatchDetailsModal';
import { UserDashboardModal } from './components/dashboard/UserDashboardModal';
import { AuthModal } from './components/common/AuthModal';
import { calculateBookingTotals } from './data/bookingTotals';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'matches' | 'stadium-tour' | 'stadium-fullscreen' | 'confirmed'>('home');
  const [activeMatch, setActiveMatch] = useState<Match>(MATCHES_DATA[0]);
  const [selectedStand, setSelectedStand] = useState<StandSection | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{ addon: FanAddon; quantity: number }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [matchDetailsTarget, setMatchDetailsTarget] = useState<Match | null>(null);

  // Authentication & Profile
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Confirmed booking state
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<{
    match: Match;
    stand: StandSection;
    seats: Seat[];
    addons: { addon: FanAddon; quantity: number }[];
    bookingRef: string;
    turnstileCode: string;
  } | null>(null);

  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);

  const scrollToFixtures = () => {
    const scroll = () => {
      document.getElementById('fixtures')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    };

    if (currentView !== 'home') {
      setCurrentView('home');
      window.requestAnimationFrame(() => window.requestAnimationFrame(scroll));
      return;
    }

    scroll();
  };

  // Open the dedicated full-screen 3D stadium experience
  const handleLaunch3DStadium = (match: Match, stand?: StandSection) => {
    setActiveMatch(match);
    setSelectedStand(stand ?? null);
    setCurrentView('stadium-fullscreen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartStadiumTour = (match: Match) => {
    setActiveMatch(match);
    setSelectedStand(null);
    setCurrentView('stadium-tour');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckoutFromStadium = (
    match: Match,
    stand: StandSection,
    seats: Seat[],
    addons: { addon: FanAddon; quantity: number }[]
  ) => {
    setActiveMatch(match);
    setSelectedStand(stand);
    setSelectedSeats(seats);
    setSelectedAddons(addons);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (bookingRef: string, turnstileCode: string) => {
    const bookingStand = selectedStand ?? STADIUM_STANDS[0];
    const totals = calculateBookingTotals(selectedSeats, selectedAddons);
    const newTicket: UserTicket = {
      bookingId: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingReference: bookingRef,
      match: activeMatch,
      stand: bookingStand,
      seats: selectedSeats,
      addons: selectedAddons,
      totalPaid: totals.total,
      currency: 'INR',
      bookedAt: new Date().toISOString(),
      qrCodeValue: `${bookingRef}-${bookingStand.id}-${selectedSeats.map(s => s.id).join('-')}`,
      gateEntrance: bookingStand.tier === 'VIP Pavilion' ? 'Gate 01, Presidential Corridor' : 'Gate 03 / Gate 04 Turnstiles',
      turnstileCode
    };

    setUserTickets((prev) => [newTicket, ...prev]);
    setLastConfirmedBooking({
      match: activeMatch,
      stand: bookingStand,
      seats: selectedSeats,
      addons: selectedAddons,
      bookingRef,
      turnstileCode
    });
    setIsCheckoutOpen(false);
    setCurrentView('confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cp-app min-h-screen flex flex-col bg-[#F3EFE6] text-[#292929] selection:bg-[#E78260] selection:text-white">
      {/* Navbar rendered ONLY on matches list and non-home views (removed from landing page as requested) */}
      {currentView === 'matches' && (
        <Navbar
          currentView="matches"
          onNavigate={(view) => {
            if (view === 'stadium') {
              handleLaunch3DStadium(activeMatch);
            } else if (view === 'matches') {
              scrollToFixtures();
            } else {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          selectedSeatsCount={selectedSeats.length}
          onOpenDashboard={() => isLoggedIn ? setIsDashboardOpen(true) : setIsAuthOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onAcquirePass={() => handleLaunch3DStadium(activeMatch)}
        />
      )}

      <div className="flex-1">
        {/* =========================================================================
            VIEW 1: RICH, VIBRANT & ART-DIRECTED CINEMATIC LANDING PAGE
            ========================================================================= */}
        {currentView === 'home' && (
          <main aria-label="CRICPASS home">
            {/* 1. Monumental Hero Section (Fixed background 3D, no scroll zoom, profile button in top-right) */}
            <HeroSection
              featuredMatch={MATCHES_DATA[0]}
              onBookTickets={() => handleLaunch3DStadium(MATCHES_DATA[0])}
              onExploreStadium={(match) => handleStartStadiumTour(match)}
              onOpenProfile={() => isLoggedIn ? setIsDashboardOpen(true) : setIsAuthOpen(true)}
              onBrowseMatches={scrollToFixtures}
              userName={userName}
              isLoggedIn={isLoggedIn}
            />

            {/* 2. Featured Match Booking Showcase (Color-Harmonized Replacement for Old Clunky Dock) */}
            <FeaturedMatchBookingShowcase
              match={MATCHES_DATA[0]}
              onBookTickets={(m, stand) => handleLaunch3DStadium(m, stand)}
              onExploreStadium={(m, stand) => handleLaunch3DStadium(m, stand)}
            />

            {/* 3. The Spatial WebGL Sightline Engine Showcase */}
            <UpcomingMatchesRibbon
              onSelectMatch={(match) => handleLaunch3DStadium(match)}
              onViewDetails={(m) => setMatchDetailsTarget(m)}
              onViewAllMatches={scrollToFixtures}
            />

          </main>
        )}

        {/* =========================================================================
            VIEW 2: DEDICATED FULL-SCREEN 3D STADIUM & SEAT POV EXPERIENCE
            ========================================================================= */}
        {currentView === 'stadium-fullscreen' && (
          <FullScreenStadiumExperience
            match={activeMatch}
            initialStand={selectedStand ?? undefined}
            onReturnToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onProceedToCheckout={handleProceedToCheckoutFromStadium}
          />
        )}

        {currentView === 'stadium-tour' && (
          <StadiumTourExperience
            onExit={() => setCurrentView('home')}
            onChooseTickets={() => handleLaunch3DStadium(activeMatch)}
          />
        )}

        {/* =========================================================================
            VIEW 3: COMPLETE TOURNAMENT FIXTURES CATALOG
            ========================================================================= */}
        {currentView === 'matches' && (
          <MatchDiscoveryView
            onSelectMatch={(match) => handleLaunch3DStadium(match)}
            onViewDetails={(m) => setMatchDetailsTarget(m)}
          />
        )}

        {/* =========================================================================
            VIEW 4: CONFIRMED CRYPTOGRAPHIC TURNSTILE MATCH PASS
            ========================================================================= */}
        {currentView === 'confirmed' && lastConfirmedBooking && (
          <BookingSuccessTicket
            match={lastConfirmedBooking.match}
            stand={lastConfirmedBooking.stand}
            selectedSeats={lastConfirmedBooking.seats}
            selectedAddons={lastConfirmedBooking.addons}
            bookingReference={lastConfirmedBooking.bookingRef}
            turnstileCode={lastConfirmedBooking.turnstileCode}
            onReturnHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>

      {/* Footer rendered only on normal landing/fixtures pages */}
      {currentView !== 'stadium-fullscreen' && currentView !== 'stadium-tour' && <Footer />}

      {/* Checkout Modal */}
      {isCheckoutOpen && <CheckoutPaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        match={activeMatch}
        stand={selectedStand}
        selectedSeats={selectedSeats}
        selectedAddons={selectedAddons}
        onPaymentSuccess={handlePaymentSuccess}
      />}

      {/* Match Details Dossier Modal */}
      <MatchDetailsModal
        match={matchDetailsTarget}
        isOpen={Boolean(matchDetailsTarget)}
        onClose={() => setMatchDetailsTarget(null)}
        onProceedToBooking={(match) => handleLaunch3DStadium(match)}
      />

      {/* User Passport / Requisition Dossier Modal (Personal Details) */}
      <UserDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        userTickets={userTickets}
        userName={userName}
        userEmail={userEmail}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(name, email) => {
          setIsLoggedIn(true);
          setUserName(name);
          setUserEmail(email);
        }}
      />
    </div>
  );
}

export default App;
