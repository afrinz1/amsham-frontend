import React from 'react';
import { Message } from '../types';
import { X, Quote, Calendar, Share2, Check } from 'lucide-react';

interface MessageDetailModalProps {
  message: Message | null;
  onClose: () => void;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  message,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!message) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${message.recipient_name}\n"${message.content}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#32E6D8] text-black shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        {/* Top White Header Strip matching card style */}
        <div className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-black/10">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-black fill-black" />
            <span className="text-sm sm:text-base font-semibold tracking-tight">
              To: {message.recipient_name.toLowerCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1 text-black/70 hover:text-black rounded hover:bg-black/5 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <p className="text-lg sm:text-xl leading-relaxed tracking-reduced font-normal text-black whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3.5 bg-black/5 border-t border-black/10 flex items-center justify-between text-xs text-black/70">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(message.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#32E6D8]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
