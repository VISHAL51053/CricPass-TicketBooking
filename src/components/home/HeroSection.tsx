import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import type { Match, StandSection } from '../../types';
import { CricketStadiumScene } from '../stadium3d/CricketStadiumScene';
import { ArrowDown, ArrowRight, Compass, Ticket, UserRound } from 'lucide-react';

interface HeroSectionProps {
  featuredMatch: Match;
  onBookTickets: (match: Match) => void;
  onExploreStadium: (match: Match, stand?: StandSection) => void;
  onOpenProfile: () => void;
  onBrowseMatches: () => void;
  userName?: string;
  isLoggedIn?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredMatch,
  onBookTickets,
  onExploreStadium,
  onOpenProfile,
  onBrowseMatches,
  userName,
  isLoggedIn
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.12
        });
      }
      gsap.from('.cp-hero-copy > :not(h1)', {
        y: 14,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.35
      });
    }, heroRef);

    return () => context.revert();
  }, []);

  const matchDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(featuredMatch.dateTime));
  const matchTime = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(featuredMatch.dateTime));

  return (
    <section ref={heroRef} id="top" className="cp-hero" aria-labelledby="hero-title">
      <div className="cp-hero-scene" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 1.4]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            powerPreference: 'high-performance'
          }}
          camera={{ position: [24, 38, 52], fov: 42, near: 0.2, far: 500 }}
        >
          <CricketStadiumScene
            selectedStand={null}
            onSelectStand={(stand) => onExploreStadium(featuredMatch, stand)}
            hoveredStand={null}
            onHoverStand={() => undefined}
            seats={[]}
            selectedSeats={[]}
            onToggleSeat={() => undefined}
            hoveredSeat={null}
            onHoverSeat={() => undefined}
            timeOfDay="golden-hour"
            viewMode="overview"
            isAutoRotate={false}
            isBallTrajectoryActive={false}
            enableZoom={false}
          />
        </Canvas>
      </div>

      <div className="cp-hero-shade" aria-hidden="true" />

      <header className="cp-hero-header">
        <a className="cp-wordmark" href="#top" aria-label="CRICPASS home">
          <span className="cp-mark" aria-hidden="true">C</span>
          <span className="cp-wordmark-copy">
            <strong>CRICPASS</strong>
            <small>See it before you sit</small>
          </span>
        </a>

        <div className="cp-hero-header-actions">
          <nav className="cp-hero-nav" aria-label="Main navigation">
            <button type="button" onClick={onBrowseMatches}>Fixtures</button>
            <a href="#match-booking">How it works</a>
          </nav>

          <button
            className={`cp-account-link ${isLoggedIn ? 'is-logged-in' : ''}`}
            type="button"
            onClick={onOpenProfile}
            aria-label={isLoggedIn ? `User Profile (${userName || 'Member'})` : 'Sign in to CRICPASS'}
          >
            <UserRound size={15} aria-hidden="true" />
            <span>{isLoggedIn && userName ? userName.split(' ')[0] : 'Sign in'}</span>
            {isLoggedIn && <span className="cp-account-dot" aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className="cp-hero-content">
        <div className="cp-hero-copy">
          <p className="cp-eyebrow">
            <span className="cp-eyebrow-mark" aria-hidden="true" />
            {featuredMatch.tournament} <span>·</span> {featuredMatch.matchNumber}
          </p>

          <h1 id="hero-title" ref={titleRef}>
            <span>Find your</span>
            <span className="cp-title-accent">view of the game.</span>
          </h1>

          <p className="cp-hero-intro">
            Walk the stands in 3D. Pick a seat by its real position and see the pitch from there.
          </p>

          <div className="cp-hero-actions">
            <button className="cp-button cp-button-primary" type="button" onClick={() => onExploreStadium(featuredMatch)}>
              <Compass size={16} aria-hidden="true" />
              Explore the stadium
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button className="cp-button cp-button-quiet" type="button" onClick={() => onBookTickets(featuredMatch)}>
              <Ticket size={16} aria-hidden="true" />
              Choose tickets
            </button>
          </div>
        </div>
      </div>

      <div className="cp-hero-footer">
        <div className="cp-featured-match">
          <span className="cp-featured-label">Featured match</span>
          <strong>{featuredMatch.teamA.shortName} <span>v</span> {featuredMatch.teamB.shortName}</strong>
          <span>{matchDate} · {matchTime}</span>
          <span>{featuredMatch.venue.name}, {featuredMatch.venue.city}</span>
        </div>
        <div className="cp-hero-price">
          <span>Tickets from</span>
          <strong>₹{featuredMatch.minPrice.toLocaleString('en-IN')}</strong>
        </div>
        <a className="cp-scroll-cue" href="#match-booking">
          Explore the fixture <ArrowDown size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};
