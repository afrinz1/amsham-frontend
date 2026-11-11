import React, { useState } from 'react';
import {
  getApiBaseUrl,
  setApiBaseUrl,
} from '../services/api';
import { X, Server, Check, RotateCcw } from 'lucide-react';

interface ServerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayIntro: () => void;
  onConfigChanged: () => void;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({
  isOpen,
  onClose,
  onReplayIntro,
  onConfigChanged,
}) => {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(url);
    setSavedNotice(true);
    onConfigChanged();
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
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
        className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 text-white rounded-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#32E6D8]" />
            <h3 className="text-base font-medium tracking-tight">Django API Connection</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-neutral-400">
              API Base URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://amsham-backend-production.up.railway.app/api/messages/"
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-200 focus:border-[#32E6D8] focus:outline-none"
            />
            <p className="text-[11px] text-neutral-500">
              Use the API base URL ending in <code className="text-neutral-400">/api/messages/</code>. Search and submit paths are added automatically.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onReplayIntro();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Replay Intro
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#32E6D8] hover:bg-[#25c7ba] text-black font-semibold text-xs transition-colors"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
