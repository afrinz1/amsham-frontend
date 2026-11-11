import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { animate, motion } from 'motion/react';
import { MessageCard } from './MessageCard';
import { Message, ApiError } from '../types';
import { searchMessages } from '../services/api';
import { Search, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface HomeViewProps {
  onOpenSubmit: () => void;
  onSelectMessage: (message: Message) => void;
  initialIntroPending: boolean;
  initialIntroActive: boolean;
  onInitialCardsAnimationStart: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenSubmit,
  onSelectMessage,
  initialIntroPending,
  initialIntroActive,
  onInitialCardsAnimationStart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [searchedName, setSearchedName] = useState<string>('');
  const cardElements = useRef(new Map<number, HTMLDivElement>());
  const [cardOffsets, setCardOffsets] = useState<Record<number, { x: number; y: number }> | null>(null);
  const hasMeasuredInitialCards = useRef(false);

  const loadInitial = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMessages('');
      setMessages(results.slice(0, 5));
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  useLayoutEffect(() => {
    if (!initialIntroActive || loading || error || messages.length === 0 || hasMeasuredInitialCards.current) {
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsets: Record<number, { x: number; y: number }> = {};
    messages.forEach((message, index) => {
      const element = cardElements.current.get(message.id);
      if (!element) return;

      const bounds = element.getBoundingClientRect();
      const offset = {
        x: centerX - (bounds.left + bounds.width / 2),
        y: centerY - (bounds.top + bounds.height / 2),
      };
      offsets[message.id] = offset;

      animate(
        element,
        {
          x: [offset.x, 0],
          y: [offset.y, 0],
          rotate: [(index % 2 === 0 ? -1 : 1) * (3 + index), 0],
          scale: [0.86, 1],
          opacity: [0.45, 1],
        },
        {
          duration: 1.65,
          delay: index * 0.055,
          ease: [0.16, 1, 0.3, 1],
        },
      );
    });

    if (Object.keys(offsets).length > 0) {
      hasMeasuredInitialCards.current = true;
      setCardOffsets(offsets);
      onInitialCardsAnimationStart();
    }
  }, [initialIntroActive, loading, error, messages, onInitialCardsAnimationStart]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    setSearchedName(query);

    if (!query) {
      setMessages([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchMessages(query);
      setMessages(results.slice(0, 5));
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchedName('');
    loadInitial();
  };

  return (
    <motion.div
      className="flex-1 flex flex-col justify-between items-center w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20 relative select-none"
      initial={initialIntroPending ? { opacity: 0, y: 8 } : false}
      animate={
        initialIntroActive
          ? { opacity: 1, y: 0 }
          : initialIntroPending
            ? { opacity: 0, y: 8 }
            : { opacity: 1, y: 0 }
      }
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle floor spotlight matching reference screenshot 3 */}
      <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none bg-[radial-gradient(ellipse_60%_35%_at_50%_95%,rgba(255,255,255,0.06)_0%,transparent_75%)]" />

      {/* Hero Quote Section */}
      <div className="w-full max-w-3xl text-center space-y-6 sm:space-y-8 z-10 pt-2 sm:pt-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-light tracking-reduced leading-snug sm:leading-relaxed">
          “Some words are easier to write{' '}
          <span className="font-inter text-[#32E6D8] font-normal tracking-normal">
  when they don’t have to be sent.</span>”
        </h2>

        {/* Recipient-name search bar matching reference screenshot 3 */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search for a name"
              className="w-full bg-[#d6d6d6] hover:bg-[#e0e0e0] focus:bg-white text-black placeholder:text-neutral-600 text-sm sm:text-base px-4 py-2.5 rounded-none outline-none transition-colors tracking-reduced pr-20"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-neutral-600 hover:text-black rounded"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-2.5 py-1 text-xs font-medium text-black/80 hover:text-black bg-black/10 hover:bg-black/20 transition-colors"
                aria-label="Search"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Message Preview Cards Section */}
      <div className="w-full my-8 sm:my-12 z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-[#32E6D8] animate-spin" />
            <span className="text-xs text-neutral-400 tracking-tight">Accessing unsent drafts...</span>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-6 bg-neutral-950/80 border border-neutral-800 rounded text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error.message}</span>
            </div>

            {error.isNetworkError && (
              <div className="text-xs text-neutral-400 space-y-3">
                <p>
                  The Django API could not be reached at the configured URL.
                </p>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => handleSearch()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-base text-neutral-300 tracking-reduced">
              {searchedName
                ? 'No messages found for this name yet.'
                : 'Search for a recipient to view their approved messages.'}
            </p>
            {searchedName && (
              <button
                onClick={handleClearSearch}
                className="text-xs text-[#32E6D8] hover:underline"
              >
                Clear search and view all
              </button>
            )}
          </div>
        ) : (
          /* Cards preview row: 5 cards across on desktop matching screenshot 3 */
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 w-full">
            {messages.map((message) => {
              return (
                <motion.div
                  key={message.id}
                  ref={(element) => {
                    if (element) cardElements.current.set(message.id, element);
                    else cardElements.current.delete(message.id);
                  }}
                  style={{
                    visibility: initialIntroActive && !cardOffsets ? 'hidden' : 'visible',
                  }}
                >
                  <MessageCard
                    message={message}
                    onClick={() => onSelectMessage(message)}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom CTA Button: "leave yours here" matching screenshot 3 */}
      <div className="z-10 mt-2 mb-4 hidden md:block">
        <button
          onClick={onOpenSubmit}
          className="group relative inline-flex items-center justify-center px-8 py-2.5 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/40 hover:border-[#32E6D8] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-[#32E6D8]/50"
        >
          <span className="text-sm font-normal text-white tracking-reduced transition-colors">
            leave yours <span className="text-[#32E6D8] font-medium group-hover:underline">here</span>
          </span>
        </button>
      </div>
    </motion.div>
  );
};
