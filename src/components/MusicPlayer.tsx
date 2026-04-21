import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "CORRUPT_01",
    artist: "Algorithmic Entity 01",
    url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    color: "cyan"
  },
  {
    id: 2,
    title: "SIG_LOST",
    artist: "Neural Net Audio",
    url: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3",
    color: "fuchsia"
  },
  {
    id: 3,
    title: "VOID_WAVE",
    artist: "Generative Waves",
    url: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
    color: "cyan"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Autoplay prevented:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="raw-border p-6 space-y-8 w-full relative bg-black">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleNext}
        loop={false}
      />
      
      <div className="text-left space-y-2">
        <div className="text-xl tracking-widest text-[#f0f] animate-pulse">STATUS: {isPlaying ? 'STREAMING' : 'IDLE'}</div>
        <div className="text-3xl font-black truncate text-[#0ff]">{currentTrack.title}.wav</div>
        <div className="text-xl text-white">&gt; {currentTrack.artist}</div>
      </div>

      <div className="relative h-4 bg-zinc-900 border border-[#f0f] w-full mt-4">
        <div className="absolute h-full bg-[#0ff]" style={{ width: isPlaying ? '100%' : '65%', transition: isPlaying ? 'width 180s linear' : 'none' }}></div>
      </div>

      <div className="flex justify-between items-center px-4 mt-8">
        <button 
          onClick={handlePrev}
          className="text-[#0ff] hover:text-[#f0f] hover:scale-110 active:scale-95 transition-all outline-none"
        >
          <SkipBack className="w-8 h-8 fill-current" />
        </button>
        
        <button 
          onClick={togglePlay}
          className={`w-16 h-16 border-4 ${isPlaying ? 'border-[#f0f] text-[#f0f] hover:animate-none animate-pulse' : 'border-[#0ff] text-[#0ff]'} bg-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform outline-none`}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current translate-x-0.5" />
          )}
        </button>

        <button 
          onClick={handleNext}
          className="text-[#0ff] hover:text-[#f0f] hover:scale-110 active:scale-95 transition-all outline-none"
        >
          <SkipForward className="w-8 h-8 fill-current" />
        </button>
      </div>

      <div className="flex justify-center gap-4 pt-4 border-t-2 border-dashed border-[#0ff] mt-4">
        <div className="flex items-center gap-2 text-xl text-white uppercase tracking-tighter mt-4">
          <div className={`w-4 h-4 ${isPlaying ? 'bg-[#f0f] animate-bounce' : 'bg-zinc-600'}`}></div> 
          SYS.AUDIO_OUT
        </div>
      </div>
    </div>
  );
}
