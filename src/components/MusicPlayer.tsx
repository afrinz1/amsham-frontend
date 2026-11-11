import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, Music2 } from 'lucide-react';

const SONG_SRC = '/audio/bgsong.mp3';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setPlaybackBlocked(false);
    } catch {
      setIsPlaying(false);
      setPlaybackBlocked(true);
    }
  };

  const handleListen = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setIsPlaying(true);
      setPlaybackBlocked(false);
      setShowMusicPrompt(false);
    } catch {
      setIsPlaying(false);
      setPlaybackBlocked(true);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (Number.isFinite(audio.duration)) setDuration(audio.duration);
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar || !duration) return;

    const bounds = progressBar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {showMusicPrompt && (
        <div
          role="dialog"
          aria-label="Listen to music"
          className="fixed bottom-14 right-4 z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-neutral-800/80 bg-neutral-950/90 px-3.5 py-2.5 shadow-xl shadow-black/30 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Music2 className="h-3.5 w-3.5 shrink-0 text-[#32E6D8]" />
            <span>{playbackBlocked ? 'Music could not start. Try again?' : 'Listen to music?'}</span>
          </div>
          <button
            onClick={handleListen}
            className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-black transition-colors hover:bg-[#32E6D8] focus:outline-none focus:ring-2 focus:ring-[#32E6D8]/70"
          >
            Listen
          </button>
          <button
            onClick={() => setShowMusicPrompt(false)}
            className="text-[11px] text-neutral-500 transition-colors hover:text-white focus:outline-none"
          >
            Not now
          </button>
        </div>
      )}

      <aside
        aria-label="Background music player"
        className="fixed bottom-3.5 right-4 z-40 select-none"
      >
      <audio
        ref={audioRef}
        src={SONG_SRC}
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          setPlaybackBlocked(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setPlaybackBlocked(true);
        }}
      />

      <div
        className="group relative flex items-center gap-2 rounded-full border border-neutral-800/60 bg-neutral-950/75 px-2.5 py-1.5 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-neutral-700/80 hover:bg-neutral-950/95"
        onMouseEnter={() => setShowTimeTooltip(true)}
        onMouseLeave={() => {
          setShowTimeTooltip(false);
          setShowVolume(false);
        }}
      >
        <button
          onClick={togglePlay}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-[#32E6D8] focus:outline-none"
          aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
          title={playbackBlocked ? 'Playback needs your interaction' : undefined}
        >
          {isPlaying ? (
            <Pause className="h-2.5 w-2.5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-2.5 w-2.5 fill-current" />
          )}
        </button>

        <div className="flex min-w-0 items-center gap-1.5 pr-0.5">
          <Music2 className={`h-3 w-3 shrink-0 ${isPlaying ? 'animate-pulse text-[#32E6D8]' : 'text-neutral-500'}`} />
          <span className="max-w-[110px] truncate text-[11px] font-normal leading-none tracking-reduced text-neutral-300 group-hover:text-white">
            {playbackBlocked && !isPlaying ? 'tap to play' : 'unsent'}
          </span>
        </div>

        <div className="relative flex items-center">
          <button
            onClick={() => setShowVolume((visible) => !visible)}
            className="p-1 text-neutral-400 transition-colors hover:text-white focus:outline-none"
            aria-label="Background music volume"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-3 w-3 text-neutral-500" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </button>

          {showVolume && (
            <div className="absolute bottom-7 right-0 z-50 flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 p-2 shadow-xl">
              <button
                onClick={() => setIsMuted((muted) => !muted)}
                className="p-0.5 text-neutral-400 hover:text-white"
                aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
              >
                {isMuted ? (
                  <VolumeX className="h-3 w-3 text-red-400" />
                ) : (
                  <Volume2 className="h-3 w-3 text-[#32E6D8]" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(event) => {
                  setVolume(Number.parseFloat(event.target.value));
                  setIsMuted(false);
                }}
                className="h-1 w-16 cursor-pointer appearance-none rounded bg-neutral-800 accent-[#32E6D8]"
                aria-label="Volume level"
              />
            </div>
          )}
        </div>

        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          className="absolute inset-x-3 bottom-0 h-[2px] cursor-pointer overflow-hidden rounded-full bg-neutral-800/60 transition-all group-hover:h-[3px]"
          title="Click to seek"
        >
          <div
            className="h-full rounded-full bg-[#32E6D8]/80 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {showTimeTooltip && (
          <div className="pointer-events-none absolute -top-6 right-2 rounded border border-neutral-800/60 bg-black/90 px-1.5 py-0.5 font-mono text-[9px] tabular-nums tracking-reduced text-neutral-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>
      </aside>
    </>
  );
};
