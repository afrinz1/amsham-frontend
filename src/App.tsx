import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { BinView } from './components/BinView';
import { AboutView } from './components/AboutView';
import { PrivacyView } from './components/PrivacyView';
import { SubmitModal } from './components/SubmitModal';
import { MessageDetailModal } from './components/MessageDetailModal';
import { IntroLoader } from './components/IntroLoader';
import { MusicPlayer } from './components/MusicPlayer';
import { ServerConfigModal } from './components/ServerConfigModal';
import { Message } from './types';
import { Instagram, Linkedin, Settings, Volume2, VolumeX } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  // Start with loading animation: Image 1 -> Image 2 -> Home page Image 3
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [initialIntroPending, setInitialIntroPending] = useState<boolean>(true);
  const [initialIntroActive, setInitialIntroActive] = useState<boolean>(false);
  const hasCompletedInitialIntro = useRef(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'bin' | 'about' | 'privacy'>('home');
  const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [serverConfigOpen, setServerConfigOpen] = useState<boolean>(false);
  const [creatorMenuOpen, setCreatorMenuOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isLightMode, setIsLightMode] = useState(
    () => window.localStorage.getItem('unsent-theme') === 'light',
  );
  const [clickSoundsEnabled, setClickSoundsEnabled] = useState(
    () => window.localStorage.getItem('unsent-click-sounds') !== 'false',
  );
  const clickAudioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    window.localStorage.setItem('unsent-theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  useEffect(() => {
    window.localStorage.setItem('unsent-click-sounds', String(clickSoundsEnabled));
  }, [clickSoundsEnabled]);

  useEffect(() => {
    if (!clickSoundsEnabled) return;

    const playClickSound = () => {
      if (!window.AudioContext) return;

      const audioContext = clickAudioContextRef.current ?? new window.AudioContext();
      clickAudioContextRef.current = audioContext;

      const play = () => {
        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1150, now);
        oscillator.frequency.exponentialRampToValueAtTime(650, now + 0.045);
        gain.gain.setValueAtTime(0.016, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.045);
      };

      if (audioContext.state === 'suspended') {
        void audioContext.resume().then(play).catch((error: unknown) => {
          console.error('Unable to start click sound:', error);
        });
      } else {
        play();
      }
    };

    document.addEventListener('click', playClickSound);
    return () => document.removeEventListener('click', playClickSound);
  }, [clickSoundsEnabled]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    if (!hasCompletedInitialIntro.current) {
      hasCompletedInitialIntro.current = true;
      setInitialIntroPending(false);
      setInitialIntroActive(true);
    }
  }, []);

  const handleInitialCardsAnimationStart = useCallback(() => {
    setInitialIntroActive(false);
  }, []);

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleConfigChanged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={`theme-transition relative isolate min-h-screen bg-black text-white flex flex-col font-sans ambient-lighting overflow-x-hidden selection:bg-[#32E6D8] selection:text-black${isLightMode ? ' theme-light' : ''}`}>
      <video
        className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700${isLightMode ? ' opacity-40' : ' opacity-100'}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/assets/ui/bg_video.mp4" type="video/mp4" />
      </video>
      <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-700 ${isLightMode ? 'bg-[#f7f6f0]/30' : 'bg-black/65'}`} />

      {/* Intro Loading Animation: 1_c95e78ef -> 2_ab900275 -> 3_dab783e1 */}
      <AnimatePresence>
        {showIntro && <IntroLoader key="intro" onComplete={handleIntroComplete} isLightMode={isLightMode} />}
      </AnimatePresence>

      {/* Top Header Bar */}
      <motion.div
        className="z-20"
        initial={initialIntroPending ? { opacity: 0, y: -8 } : false}
        animate={
          initialIntroActive
            ? { opacity: 1, y: 0 }
            : initialIntroPending
              ? { opacity: 0, y: -8 }
              : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
      >
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isLightMode={isLightMode}
          onToggleTheme={() => setIsLightMode((lightMode) => !lightMode)}
        />
      </motion.div>

      {/* Main Content Pages */}
      <main className="relative z-10 flex-1 flex flex-col w-full" key={refreshTrigger}>
        {currentTab === 'home' && (
          <HomeView
            onOpenSubmit={() => setSubmitModalOpen(true)}
            onSelectMessage={(msg) => setSelectedMessage(msg)}
            initialIntroPending={initialIntroPending}
            initialIntroActive={initialIntroActive}
            onInitialCardsAnimationStart={handleInitialCardsAnimationStart}
          />
        )}

        {currentTab === 'bin' && (
          <BinView
            onSelectMessage={(msg) => setSelectedMessage(msg)}
            onOpenSubmit={() => setSubmitModalOpen(true)}
          />
        )}

        {currentTab === 'about' && (
          <AboutView onOpenSubmit={() => setSubmitModalOpen(true)} />
        )}

        {currentTab === 'privacy' && <PrivacyView />}
      </main>

      {/* Submit Message Modal (POST /api/messages/create/) */}
      <SubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSubmittedSuccess={() => {
          // If in bin or home, triggers refresh
          setRefreshTrigger((prev) => prev + 1);
        }}
      />

      {/* Message Reader / Detail Modal */}
      <MessageDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      {/* Django REST API Config & Settings Modal */}
      <ServerConfigModal
        isOpen={serverConfigOpen}
        onClose={() => setServerConfigOpen(false)}
        onReplayIntro={handleReplayIntro}
        onConfigChanged={handleConfigChanged}
      />

      {currentTab === 'home' && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+3.75rem)] left-1/2 z-30 -translate-x-1/2 md:hidden">
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="group relative inline-flex items-center justify-center rounded-full border border-white/40 bg-neutral-900/80 px-6 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:border-[#32E6D8] focus:outline-none focus:ring-2 focus:ring-[#32E6D8]/50"
          >
            <span className="text-sm font-normal tracking-reduced text-white transition-colors">
              leave yours <span className="font-medium text-[#32E6D8] group-hover:underline">here</span>
            </span>
          </button>
        </div>
      )}

      {/* Compact, Fixed Music Player at bottom */}
      <MusicPlayer />

      {/* Creator links and API settings */}
      <div className="fixed bottom-3 left-3 z-40">
        {creatorMenuOpen && (
          <div
            role="dialog"
            aria-label="Creator links"
            className="absolute bottom-10 left-0 w-52 rounded-xl border border-neutral-800 bg-neutral-950/95 p-3 shadow-xl backdrop-blur-md"
          >
            <p className="mb-2 text-[10px] uppercase tracking-wider text-neutral-500">Creator</p>
            <p className="mb-3 text-sm font-medium text-white">Afrin</p>
            <div className="flex flex-col gap-1">
              <a
                href="https://www.linkedin.com/in/afrinzero1/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
              >
                <Linkedin className="h-3.5 w-3.5 text-[#32E6D8]" />
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/afrin.h264/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
              >
                <Instagram className="h-3.5 w-3.5 text-[#32E6D8]" />
                Instagram
              </a>
            </div>
            <div className="my-2 border-t border-neutral-800" />
            <button
              onClick={() => setClickSoundsEnabled((enabled) => !enabled)}
              role="switch"
              aria-checked={clickSoundsEnabled}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-neutral-300 transition-colors hover:bg-neutral-900"
            >
              <span>Click sounds</span>
              <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${clickSoundsEnabled ? 'bg-[#32E6D8]/70' : 'bg-neutral-700'}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full bg-white text-black transition-transform ${clickSoundsEnabled ? 'translate-x-4' : 'translate-x-0'}`}>
                  {clickSoundsEnabled ? <Volume2 className="h-2.5 w-2.5" /> : <VolumeX className="h-2.5 w-2.5" />}
                </span>
              </span>
            </button>
            <div className="my-2 border-t border-neutral-800" />
            <button
              onClick={() => {
                setCreatorMenuOpen(false);
                setServerConfigOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300"
            >
              <Settings className="h-3.5 w-3.5" />
              API settings
            </button>
          </div>
        )}
        <button
          onClick={() => setCreatorMenuOpen((open) => !open)}
          className="group flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/70 px-2.5 py-1.5 text-[11px] text-neutral-400 shadow-lg backdrop-blur transition-all hover:border-neutral-700 hover:bg-neutral-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#32E6D8]/50"
          aria-expanded={creatorMenuOpen}
          aria-haspopup="dialog"
        >
          <span>Creator</span>
        </button>
      </div>
      <Analytics />
    </div>
  );
}
