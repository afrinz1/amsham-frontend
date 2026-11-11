import React from 'react';

interface AboutViewProps {
  onOpenSubmit: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenSubmit }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-6 py-12 select-none z-10">
      <div className="w-full text-center space-y-10 sm:space-y-14">
        {/* Handwritten Header */}
        <div className="space-y-3">
          <h2 className="font-amsham text-5xl sm:text-7xl text-white font-normal tracking-wide">
            amsham
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 tracking-reduced font-light">
            / am·sham / — <span className="italic text-neutral-300">an essence, an unspoken fragment left behind.</span>
          </p>
        </div>

        {/* Minimalist Prose with Inter reduced letter spacing */}
        <div className="space-y-6 text-neutral-300 text-base sm:text-lg leading-relaxed tracking-reduced font-light max-w-xl mx-auto">
          <p>
            Some words are never meant to arrive. They are written in the stillness of 2 AM, typed into drafts that get erased, or carried for years in silence.
          </p>
          <p>
            <strong className="font-medium text-white">unsent.</strong> is an anonymous sanctuary built for those thoughts. A safe harbor where confessions, apologies, gratitude, and goodbyes can be released into the universe without fear of consequence.
          </p>
          <p className="text-sm sm:text-base text-neutral-400">
            No sender profiles. No tracking. No algorithmic noise. Every submission is reviewed with care to preserve a quiet, compassionate space.
          </p>
        </div>

        {/* Decorative subtle line */}
        <div className="w-16 h-[1px] bg-neutral-800 mx-auto" />

        {/* CTA */}
        <div>
          <button
            onClick={onOpenSubmit}
            className="group inline-flex items-center justify-center px-8 py-2.5 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/40 hover:border-[#32E6D8] transition-all duration-300 text-sm font-normal text-white tracking-reduced"
          >
            leave yours <span className="text-[#32E6D8] font-medium ml-1 group-hover:underline">here</span>
          </button>
        </div>
      </div>
    </div>
  );
};
