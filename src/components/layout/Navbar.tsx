import React, { useState, useEffect } from 'react';
import { Ticket, User, Compass, Calendar } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'matches' | 'stadium' | 'confirmed';
  onNavigate: (view: 'home' | 'matches' | 'stadium') => void;
  selectedSeatsCount: number;
  onOpenDashboard: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onAcquirePass?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  selectedSeatsCount,
  onOpenDashboard,
  onOpenAuth,
  isLoggedIn,
  userName = 'Rahul S.',
  onAcquirePass
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none select-none">
      <header
        className={`pointer-events-auto w-full max-w-6xl rounded-2xl transition-all duration-300 border ${
          scrolled
            ? 'bg-[#292929]/95 backdrop-blur-2xl border-[#F3EFE6]/15 shadow-2xl py-3 px-5 sm:px-7'
            : 'bg-[#292929]/80 backdrop-blur-xl border-[#F3EFE6]/10 shadow-lg py-4 px-6 sm:px-8'
        } flex items-center justify-between text-[#F3EFE6]`}
      >
        {/* 1. CRICPASS Brand Identity (Sophisticated Reveal) */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group focus:outline-none transition-transform active:scale-95"
          title="CRICPASS Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E78260] flex items-center justify-center font-black text-sm text-[#292929] shadow-md shadow-[#E78260]/30 group-hover:rotate-6 transition-transform duration-300">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none text-[#F3EFE6]">
              CRIC<span className="text-[#E78260]">PASS</span>
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[#F3EFE6]/60 font-semibold mt-0.5">
              OFFICIAL ARENA TICKETING
            </span>
          </div>
        </button>

        {/* 2. Compact Minimal Floating Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]/80">
          <button
            onClick={() => onNavigate('matches')}
            className={`hover:text-[#E78260] transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'matches' ? 'text-[#E78260] font-bold' : ''
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#E78260]" />
            <span>Matches</span>
          </button>

          <button
            onClick={() => onAcquirePass && onAcquirePass()}
            className="hover:text-[#E78260] transition-colors py-1 flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#E78260]" />
            <span>Stadium</span>
          </button>

          <button
            onClick={onOpenDashboard}
            className="hover:text-[#E78260] transition-colors py-1 flex items-center gap-1.5"
          >
            <Ticket className="w-3.5 h-3.5 text-[#E78260]" />
            <span>My Tickets</span>
            {selectedSeatsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#E78260] text-[#292929] text-[9px] font-black flex items-center justify-center">
                {selectedSeatsCount}
              </span>
            )}
          </button>

          <button
            onClick={isLoggedIn ? onOpenDashboard : onOpenAuth}
            className="hover:text-[#E78260] transition-colors py-1 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-[#E78260]" />
            <span>{isLoggedIn ? userName.split(' ')[0] : 'Account'}</span>
          </button>
        </nav>

        {/* 3. Primary Booking Action CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onAcquirePass && onAcquirePass()}
            className="rounded-xl bg-[#E78260] hover:bg-[#d67252] text-[#292929] text-xs uppercase tracking-wider font-black px-4 sm:px-5 py-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-[#E78260]/20 flex items-center gap-2"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </button>
        </div>
      </header>
    </div>
  );
};
