import React from 'react';

interface HeaderProps {
  currentTab: 'home' | 'bin' | 'about' | 'privacy';
  onSelectTab: (tab: 'home' | 'bin' | 'about' | 'privacy') => void;
  onOpenSubmit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 pt-7 pb-4 flex items-center justify-between select-none z-20">
      {/* Brand logo: Handwritten "amsham" matching screenshots */}
      <button
        onClick={() => onSelectTab('home')}
        className="group text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#32E6D8] rounded px-1"
        aria-label="unsent home"
      >
        <span className="font-amsham text-3xl sm:text-4xl text-white font-normal tracking-wide transition-opacity group-hover:opacity-85">
          amsham
        </span>
      </button>

      {/* Main navigation */}
      <nav className="flex items-center gap-4 text-sm sm:gap-8 sm:text-lg">
        <button
          onClick={() => onSelectTab('home')}
          className={`relative pb-1 tracking-reduced transition-colors focus:outline-none ${
            currentTab === 'home'
              ? 'text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          home
          {currentTab === 'home' && (
            <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
          )}
        </button>

        <button
          onClick={() => onSelectTab('bin')}
          className={`relative pb-1 tracking-reduced transition-colors focus:outline-none ${
            currentTab === 'bin'
              ? 'text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          bin
          {currentTab === 'bin' && (
            <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
          )}
        </button>

        <button
          onClick={() => onSelectTab('about')}
          className={`relative pb-1 tracking-reduced transition-colors focus:outline-none ${
            currentTab === 'about'
              ? 'text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          about
          {currentTab === 'about' && (
            <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
          )}
        </button>

        <button
          onClick={() => onSelectTab('privacy')}
          className={`relative pb-1 tracking-reduced transition-colors focus:outline-none ${
            currentTab === 'privacy'
              ? 'text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          privacy
          {currentTab === 'privacy' && (
            <span className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full bg-white" />
          )}
        </button>
      </nav>
    </header>
  );
};
