import React from 'react';
import { Message } from '../types';

interface MessageCardProps {
  message: Message;
  onClick?: () => void;
  className?: string;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onClick,
  className = '',
}) => {
  return (
    <article
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex flex-col w-full h-[230px] sm:h-[245px] bg-[#32E6D8] overflow-hidden text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(50,230,216,0.25)] cursor-pointer select-none ${className}`}
      aria-label={`Unsent message to ${message.recipient_name}`}
    >
      {/* Top Header Strip: White bar matching screenshots */}
      <div className="bg-white px-3.5 py-2 flex items-center justify-between border-b border-black/5 shrink-0">
        <span className="text-xs sm:text-[13px] font-medium tracking-tight text-black truncate max-w-[70%]">
          To: {message.recipient_name.toLowerCase()}
        </span>
        {/* Quote mark icon matching reference attachment */}
        <div className="w-5 h-5 shrink-0 flex items-center justify-center">
          <img
            src="/assets/images/quote-mark.png"
            alt=""
            aria-hidden="true"
            className="w-4 h-4 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Message Body: Cyan background, black Inter typography with reduced letter spacing */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-hidden">
        <p className="text-[15px] sm:text-[16px] leading-[1.35] tracking-reduced text-black font-normal line-clamp-6 break-words whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Subtle timestamp in subtle dark tone */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-black/60 tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
          <span>{new Date(message.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          <span className="underline text-[10px]">read</span>
        </div>
      </div>
    </article>
  );
};
