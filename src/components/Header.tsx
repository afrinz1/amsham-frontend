import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Moon, Sun, X } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'bin' | 'about' | 'privacy';
  onSelectTab: (tab: 'home' | 'bin' | 'about' | 'privacy') => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
}

const navItems = [
  { tab: 'home', label: 'home' },
  { tab: 'bin', label: 'archives' },
  { tab: 'about', label: 'about' },
  { tab: 'privacy', label: 'privacy' },
] as const;

interface ThemeToggleProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isLightMode, onToggleTheme }) => (
  <button
    type="button"
    onClick={onToggleTheme}
    aria-label={`Switch to ${isLightMode ? 'dark' : 'light'} mode`}
    aria-pressed={isLightMode}
    title={`Switch to ${isLightMode ? 'dark' : 'light'} mode`}
    className="theme-toggle-track inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-white/30 bg-neutral-900/80 p-1 shadow-lg backdrop-blur-md transition-colors duration-500 hover:border-[#32E6D8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#32E6D8]/70"
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow-md ${isLightMode ? 'ml-auto' : 'mr-auto'}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLightMode ? 'sun' : 'moon'}
          initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.7 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {isLightMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  </button>
);

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isLightMode,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectTab = (tab: HeaderProps['currentTab']) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 pt-7 pb-4 flex items-center justify-between select-none z-20">
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
      <nav aria-label="Main navigation" className="hidden items-center gap-8 text-lg md:flex">
        {navItems.map(({ tab, label }) => (
          <button
            key={tab}
            onClick={() => selectTab(tab)}
            className={`relative pb-1 tracking-reduced transition-colors focus:outline-none ${
              currentTab === tab ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {label}
            {currentTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full bg-current" />
            )}
          </button>
        ))}
        <ThemeToggle isLightMode={isLightMode} onToggleTheme={onToggleTheme} />
      </nav>

      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-neutral-900/65 text-white shadow-lg backdrop-blur-md transition-colors hover:border-[#32E6D8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#32E6D8]/70"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileMenuOpen ? 'close' : 'menu'}
              initial={{ opacity: 0, filter: 'blur(4px)', rotate: -30 }}
              animate={{ opacity: 1, filter: 'blur(0px)', rotate: 0 }}
              exit={{ opacity: 0, filter: 'blur(4px)', rotate: 30 }}
              transition={{ duration: 0.18 }}
              className="flex"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8, scale: 0.96, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, scale: 0.96, filter: 'blur(6px)' }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-12 z-30 flex w-52 flex-col gap-1 rounded-2xl border border-white/20 bg-neutral-950/90 p-2 text-sm shadow-2xl backdrop-blur-xl"
            >
              {navItems.map(({ tab, label }) => (
                <button
                  key={tab}
                  onClick={() => selectTab(tab)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left tracking-reduced transition-colors ${
                    currentTab === tab
                      ? 'bg-white/10 text-white'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {label}
                  {currentTab === tab && <span className="h-1.5 w-1.5 rounded-full bg-[#32E6D8]" />}
                </button>
              ))}
              <div className="my-1 border-t border-white/15" />
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-xs text-neutral-300">Appearance</span>
                <ThemeToggle isLightMode={isLightMode} onToggleTheme={onToggleTheme} />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
