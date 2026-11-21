import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ArrowLeft, ArrowRight, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { CricketStadiumScene } from './CricketStadiumScene';

const TOUR_DURATION = 50;

const TOUR_CAMERAS: [number, number, number][] = [
  [0, 190, 190],
  [0, 154, 134],
  [36, 126, 94],
  [58, 108, 48],
  [24, 94, 34],
  [-24, 86, 12]
];

const TOUR_TARGETS: [number, number, number][] = [
  [0, 12, 0],
  [0, 12, 0],
  [0, 11, 0],
  [0, 10, 0],
  [0, 8, 0],
  [0, 7, 0]
];

const TOUR_CHAPTERS = [
  { at: 0, title: 'A city gathers around the game', caption: 'From the first approach, the arena comes into view.', narration: 'Welcome to CRICPASS. First, choose the match you want to attend. This aerial view shows the stadium approach and the full ground before we begin selecting seats.' },
  { at: 0.25, title: 'A closer look at the colosseum', caption: 'Follow the architecture down to the stands.', narration: 'Choose a stand from the list or select a highlighted section in the stadium. Check its ticket price and availability as the camera moves toward that stand.' },
  { at: 0.5, title: 'Find your place in the stands', caption: 'Each tier brings its own angle on the game.', narration: 'Browse the rows and individual seats. Select an available seat to move to its real position and preview the view from that seat toward the pitch.' },
  { at: 0.75, title: 'The ground, in full', caption: 'Take in the pitch, the tiers and the scale of match day.', narration: 'When you find the right seat, add it to your selection. Choose Continue to review your ticket details and complete booking, or replay the tour to explore another view.' }
];
const TOUR_NARRATION = TOUR_CHAPTERS.map(({ narration }) => narration).join(' ');

const StadiumTourCamera: React.FC<{
  onChapter: (index: number) => void;
  onComplete: () => void;
  isComplete: boolean;
  reduceMotion: boolean;
}> = ({ onChapter, onComplete, isComplete, reduceMotion }) => {
  const { camera } = useThree();
  const progress = useRef(0);
  const chapter = useRef(-1);
  const completed = useRef(false);
  const positionPath = useMemo(() => new THREE.CatmullRomCurve3(TOUR_CAMERAS.map((point) => new THREE.Vector3(...point)), false, 'centripetal'), []);
  const targetPath = useMemo(() => new THREE.CatmullRomCurve3(TOUR_TARGETS.map((point) => new THREE.Vector3(...point)), false, 'centripetal'), []);

  useEffect(() => {
    if (reduceMotion) {
      camera.position.set(TOUR_CAMERAS[1][0], TOUR_CAMERAS[1][1], TOUR_CAMERAS[1][2]);
      camera.lookAt(0, 12, 0);
    }
    if (!isComplete) return;
    progress.current = 1;
    camera.position.copy(positionPath.getPointAt(1));
    camera.lookAt(targetPath.getPointAt(1));
    completed.current = true;
    onChapter(TOUR_CHAPTERS.length - 1);
  }, [camera, isComplete, onChapter, positionPath, reduceMotion, targetPath]);

  useFrame((_, delta) => {
    if (isComplete || completed.current) return;
    progress.current = Math.min(1, progress.current + delta / TOUR_DURATION);
    const t = progress.current;
    if (!reduceMotion) {
      camera.position.copy(positionPath.getPointAt(t));
      camera.lookAt(targetPath.getPointAt(t));
    }

    let nextChapter = 0;
    for (let index = 1; index < TOUR_CHAPTERS.length; index += 1) {
      if (t >= TOUR_CHAPTERS[index].at) nextChapter = index;
    }
    if (nextChapter !== chapter.current) {
      chapter.current = nextChapter;
      onChapter(nextChapter);
    }

    if (t >= 1) {
      completed.current = true;
      onComplete();
    }
  });

  return null;
};

interface StadiumTourExperienceProps {
  onExit: () => void;
  onChooseTickets: () => void;
}

export const StadiumTourExperience: React.FC<StadiumTourExperienceProps> = ({ onExit, onChooseTickets }) => {
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [isComplete, setIsComplete] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const currentChapter = TOUR_CHAPTERS[chapterIndex];
  const voiceSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(preference.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!voiceSupported || isComplete) return;
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(TOUR_NARRATION);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voices = synthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === 'en-us' && voice.default)
      ?? voices.find((voice) => voice.lang.toLowerCase() === 'en-us')
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en-'))
      ?? null;
    synthesis.speak(utterance);
    return () => synthesis.cancel();
  }, [isComplete, replayKey, voiceSupported]);

  useEffect(() => {
    if (!voiceSupported || isComplete) return;
    if (voiceEnabled) window.speechSynthesis.resume();
    else window.speechSynthesis.pause();
  }, [isComplete, voiceEnabled, voiceSupported]);

  const handleChapter = React.useCallback((index: number) => setChapterIndex(index), []);
  const finishTour = React.useCallback(() => setIsComplete(true), []);
  const handleReplay = () => {
    setChapterIndex(0);
    setIsComplete(false);
    setReplayKey((key) => key + 1);
  };
  const handleVoiceToggle = () => setVoiceEnabled((enabled) => !enabled);

  return (
    <main className="cp-tour" aria-label="CRICPASS 3D stadium tour">
      <div className="cp-tour__scene" aria-hidden="true">
        <Canvas
          dpr={[1, 1.4]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08, powerPreference: 'high-performance' }}
          camera={{ position: TOUR_CAMERAS[0], fov: 42, near: 0.2, far: 500 }}
          fallback={<div className="cp-tour__loading">Preparing the stadium…</div>}
        >
          <Suspense fallback={null}>
            <CricketStadiumScene
              selectedStand={null}
              onSelectStand={() => undefined}
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
              enableCameraController={false}
            />
          </Suspense>
          <StadiumTourCamera
            key={replayKey}
            onChapter={handleChapter}
            onComplete={finishTour}
            isComplete={isComplete}
            reduceMotion={reduceMotion}
          />
        </Canvas>
      </div>

      <div className="cp-tour__shade" aria-hidden="true" />

      <header className="cp-tour__header">
        <button className="cp-tour__back" type="button" onClick={onExit}>
          <ArrowLeft size={15} aria-hidden="true" /> Back to CRICPASS
        </button>
        <div className="cp-tour__controls">
          {voiceSupported && !isComplete && (
            <button className="cp-tour__voice" type="button" onClick={handleVoiceToggle} aria-pressed={voiceEnabled}>
              {voiceEnabled ? <Volume2 size={14} aria-hidden="true" /> : <VolumeX size={14} aria-hidden="true" />}
              {voiceEnabled ? 'Voice on' : 'Voice off'}
            </button>
          )}
          {!isComplete && (
            <button className="cp-tour__skip" type="button" onClick={finishTour}>
              Skip tour <SkipForward size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      <section className="cp-tour__story" aria-live="polite">
        <span className="cp-tour__eyebrow">CRICPASS · THE ARENA</span>
        <h1 key={currentChapter.title}>{currentChapter.title}</h1>
        <p>{voiceSupported && voiceEnabled ? currentChapter.narration : currentChapter.caption}</p>
        <div className="cp-tour__chapters" aria-label={`Tour chapter ${chapterIndex + 1} of ${TOUR_CHAPTERS.length}`}>
          {TOUR_CHAPTERS.map((chapter, index) => (
            <span key={chapter.title} className={index <= chapterIndex ? 'is-active' : ''} />
          ))}
          {!isComplete && <small>50 SEC · VOICE-GUIDED 3D TOUR</small>}
        </div>
      </section>

      {isComplete && (
        <section className="cp-tour__ending" aria-live="polite">
          <div>
            <span className="cp-tour__eyebrow">THE VIEW IS YOURS</span>
            <h2>Find your seat in the stands.</h2>
          </div>
          <div className="cp-tour__ending-actions">
            <button className="cp-tour__replay" type="button" onClick={handleReplay}>
              <RotateCcw size={14} aria-hidden="true" /> Replay tour
            </button>
            <button className="cp-tour__tickets" type="button" onClick={onChooseTickets}>
              Choose tickets <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </section>
      )}
    </main>
  );
};
