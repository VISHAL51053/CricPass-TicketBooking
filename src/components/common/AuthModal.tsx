import React, { useState } from 'react';
import { UserRound, X } from 'lucide-react';
import { useModalFocus } from '../../hooks/useModalFocus';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const dialogRef = useModalFocus(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="cp-checkout-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} className="cp-account-modal" role="dialog" aria-modal="true" aria-labelledby="cp-account-title">
        <header><div><span className="cp-stadium__eyebrow">CRICPASS · preview account</span><h2 id="cp-account-title">Your matchday profile</h2></div><button type="button" onClick={onClose} aria-label="Close profile"><X size={18} /></button></header>
        <div className="cp-account-modal__body">
          <span className="cp-account-modal__icon"><UserRound size={23} /></span>
          <p>Save a display name for this page session to personalize your booking previews.</p>
          <form onSubmit={(event) => { event.preventDefault(); onLoginSuccess(name.trim(), email.trim()); onClose(); }}>
            <label>Display name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required maxLength={60} placeholder="Your name" /></label>
            <label>Email address<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required maxLength={120} placeholder="you@example.com" /></label>
            <button type="submit">Continue in preview <span>→</span></button>
          </form>
          <small>This demo has no account service. Details stay in the current app state and are not sent anywhere.</small>
        </div>
      </section>
    </div>
  );
};
