import React, { useEffect, useState } from 'react';
import { MessageCard } from './MessageCard';
import { Message, ApiError } from '../types';
import { searchMessages } from '../services/api';
import { Search, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface BinViewProps {
  onSelectMessage: (message: Message) => void;
  onOpenSubmit: () => void;
}

export const BinView: React.FC<BinViewProps> = ({
  onSelectMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedName, setSearchedName] = useState('');
  const [displayCount, setDisplayCount] = useState<number>(10);

  const fetchMessages = async (query = '') => {
    const name = query.trim();
    setSearchedName(name);

    setLoading(true);
    setError(null);
    try {
      const results = await searchMessages(name);
      setMessages(results);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayCount(10);
    fetchMessages(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setDisplayCount(10);
    fetchMessages('');
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Smooth load more
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
      setLoadingMore(false);
    }, 300);
  };

  const visibleMessages = messages.slice(0, displayCount);
  const hasMore = displayCount < messages.length;

  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-24 relative select-none">
      {/* Subtle floor spotlight */}
      <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none bg-[radial-gradient(ellipse_60%_35%_at_50%_95%,rgba(255,255,255,0.06)_0%,transparent_75%)]" />

      {/* Optional subtle filter input */}
      <div className="w-full max-w-xs mb-8 z-10">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search recipient name (optional)..."
            className="w-full bg-neutral-900/80 border border-neutral-800 text-white placeholder:text-neutral-500 text-xs px-3.5 py-2 rounded-full outline-none focus:border-[#32E6D8] transition-colors pr-16"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-neutral-400 hover:text-white"
                aria-label="Clear filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="p-1 text-neutral-400 hover:text-[#32E6D8]"
              aria-label="Search"
            >
              <Search className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>

      {/* Grid of approved cards matching screenshot 4 */}
      <div className="w-full z-10 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-[#32E6D8] animate-spin" />
            <span className="text-xs text-neutral-400">Loading bin archives...</span>
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
                    onClick={() => fetchMessages(searchedName)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : visibleMessages.length === 0 ? (
          <div className="py-24 text-center space-y-2">
            <p className="text-base text-neutral-400 tracking-reduced">
              {searchedName
                ? 'No messages found for this name yet.'
                : 'The bin is currently quiet. No approved messages yet.'}
            </p>
            {searchedName && (
              <button
                onClick={handleClear}
                className="text-xs text-[#32E6D8] hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          /* Responsive 5-column grid matching screenshot 4 */
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 w-full">
            {visibleMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onClick={() => onSelectMessage(message)}
              />
            ))}
          </div>
        )}
      </div>

      {/* "more" Button matching screenshot 4 */}
      {!loading && !error && hasMore && (
        <div className="z-10 mt-10 mb-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="theme-action-button group relative inline-flex items-center justify-center px-10 py-2 rounded-full bg-[#202328]/80 backdrop-blur-md border border-white/30 hover:border-[#32E6D8] transition-all duration-300 text-white text-sm font-normal tracking-tight focus:outline-none focus:ring-2 focus:ring-[#32E6D8]/50 disabled:opacity-50"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                loading...
              </span>
            ) : (
              'more'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
