import React, { useState } from 'react';
import { submitMessage } from '../services/api';
import { ApiError } from '../types';
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmittedSuccess?: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmittedSuccess,
}) => {
  const [recipientName, setRecipientName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    const trimmedName = recipientName.trim();
    const trimmedContent = content.trim();

    if (!trimmedName) {
      setError({
        message: 'Please enter a recipient name.',
        fieldErrors: { recipient_name: ['This field may not be blank.'] },
      });
      return;
    }

    if (!trimmedContent) {
      setError({
        message: 'Please enter your message.',
        fieldErrors: { content: ['This field may not be blank.'] },
      });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitMessage({
        recipient_name: trimmedName,
        content: trimmedContent,
      });

      setRecipientName('');
      setContent('');
      setSubmittedSuccess(true);
      if (onSubmittedSuccess) {
        onSubmittedSuccess();
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setRecipientName('');
    setContent('');
    setError(null);
    setSubmittedSuccess(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0d]/85 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto border-2 border-black bg-[#f3f3f3] text-black shadow-[5px_5px_0_0_rgba(0,0,0,1)]"
      >
        <div className="font-amsham absolute right-5 top-4 text-xl text-black">
          amsham
        </div>

        {submittedSuccess ? (
          <div className="px-5 py-7 text-center sm:px-7">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#32E6D8]/30 bg-[#32E6D8]/10 text-[#32E6D8]">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-lg sm:text-xl">Words released into the quiet.</h3>
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-neutral-700 sm:text-sm">
                Your message has been submitted for moderation. It will rest in the bin once approved and will not be displayed publicly while pending.
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleResetForAnother}
                className="w-full border border-neutral-700 bg-neutral-900 px-5 py-2 text-xs font-medium text-white transition-colors hover:border-[#32E6D8] sm:w-auto"
              >
                Leave another message
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#32E6D8] px-5 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#25c7ba] sm:w-auto"
              >
                Return to unsent.
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7">
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded border border-red-700 bg-red-950/60 p-2.5 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div className="space-y-1">
                  <p className="font-medium">{error.message}</p>
                  {error.fieldErrors && (
                    <ul className="list-inside list-disc text-[11px] text-red-300/80">
                      {Object.entries(error.fieldErrors).map(([field, errs]) => (
                        <li key={field}>
                          <span className="capitalize">{field.replace('_', ' ')}</span>: {errs.join(', ')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pr-20">
              <label htmlFor="recipient-input" className="text-xl font-medium leading-none sm:text-2xl">
                To:
              </label>
              <input
                id="recipient-input"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder=""
                disabled={submitting}
                maxLength={100}
                className="min-w-0 flex-1 border-0 border-b-2 border-black bg-transparent pb-1.5 text-lg leading-none text-black placeholder:text-black/40 outline-none sm:text-xl"
              />
            </div>

            <div className="mt-5 bg-[#5ad9d2] p-3 sm:p-4">
              <p className="mb-2 text-sm leading-snug text-black sm:text-base">
                type your text here:
              </p>

              <textarea
                id="content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder=""
                disabled={submitting}
                maxLength={500}
                className="min-h-[140px] w-full resize-y border-0 bg-transparent p-0 text-2xl leading-tight text-black placeholder:text-black/50 outline-none sm:min-h-[160px] sm:text-3xl"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-black/70 sm:text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Anonymous • moderated</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="theme-keep-contrast inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
