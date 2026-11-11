import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  // Phase 1 = Image 1, Phase 2 = Image 2, Phase 3 = complete/Home
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    // Stage 1 -> Stage 2 after 2.2 seconds
    const timer1 = setTimeout(() => {
      setPhase(2);
    }, 2200);

    // Stage 2 -> Complete after another 2 seconds
    const timer2 = setTimeout(() => {
      onComplete();
    }, 4400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Skip button for accessibility */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-50 text-neutral-500 hover:text-white text-xs tracking-wider uppercase transition-colors px-3 py-1.5 rounded border border-neutral-800 hover:border-neutral-600 bg-black/40 backdrop-blur"
      >
        Skip intro
      </button>

      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="stage-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Ambient teal glows matching Image 1: top right and bottom left */}
            <div className="absolute top-0 right-0 w-[55vw] h-[55vh] pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(50,230,216,0.18)_0%,rgba(50,230,216,0.04)_40%,transparent_70%)]" />
            <div className="absolute bottom-0 left-0 w-[55vw] h-[55vh] pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,rgba(50,230,216,0.14)_0%,rgba(50,230,216,0.03)_40%,transparent_70%)]" />

            {/* Center lockup from Image 1: "leave" + emblem + "your amsham" */}
            <div className="relative z-10 flex items-center gap-4 sm:gap-7">
              <motion.span
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 0.9, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-white text-xs sm:text-sm font-light tracking-normal"
              >
                leave
              </motion.span>

              {/* Central Malayalam emblem from assets */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-24 sm:w-36 h-16 sm:h-24 flex items-center justify-center"
              >
                <img
                  src="/assets/images/emblem.png"
                  alt="അംശം"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(50,230,216,0.25)]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 0.9, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-white text-xs sm:text-sm font-light tracking-normal"
              >
                your amsham
              </motion.span>
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="stage-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center bg-black"
          >
            {/* Pure minimalist dark background matching Image 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1 className="font-amsham text-4xl sm:text-6xl text-white font-normal tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                amsham
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
