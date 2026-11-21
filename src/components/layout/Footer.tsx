import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="cp-footer">
    <div className="cp-footer-main">
      <a className="cp-wordmark" href="#top" aria-label="CRICPASS home">
        <span className="cp-mark" aria-hidden="true">C</span>
        <span className="cp-wordmark-copy">
          <strong>CRICPASS</strong>
          <small>See it before you sit</small>
        </span>
      </a>
      <p>Choose a match. Find your section. Preview the view from your seat.</p>
      <a className="cp-footer-top" href="#top">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a>
    </div>
    <div className="cp-footer-meta">
      <span>© 2026 CRICPASS</span>
      <span>Interactive booking preview · payments are not processed</span>
      <span className="cp-footer-colours" aria-label="CRICPASS brand colours">
        <i aria-hidden="true" /> Ivory · Terracotta · Electric Black
      </span>
    </div>
  </footer>
);
