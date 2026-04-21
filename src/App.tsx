/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Layers } from 'lucide-react';

export default function App() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full p-4 lg:p-8 gap-8 overflow-hidden relative bg-black text-white">
      {/* Dynamic Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.25] z-[-1]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />

      {/* Left Aside */}
      <aside className="lg:w-72 hidden lg:flex flex-col justify-between shrink-0 z-10">
        <div className="space-y-6">
          <h1 className="text-5xl font-black leading-none tracking-tighter glitch" data-text="SYS_ERR">
            SYS_ERR
          </h1>
          <div className="space-y-4 pt-8">
            <div className="text-xl tracking-widest text-[#0ff] uppercase">&gt; AUDIO_LOG</div>
            <div className="space-y-4">
              <div className="p-3 raw-border-magenta">
                <div className="text-2xl font-bold uppercase">CORRUPT_01</div>
                <div className="text-lg text-[#0ff]">&gt; Algo Entity</div>
              </div>
              <div className="p-3 raw-border opacity-50 hover:opacity-100 transition-opacity hover:jitter cursor-crosshair">
                <div className="text-2xl font-bold uppercase">SIG_LOST</div>
                <div className="text-lg text-[#f0f]">&gt; Neural Net</div>
              </div>
              <div className="p-3 raw-border opacity-50 hover:opacity-100 transition-opacity hover:jitter cursor-crosshair">
                <div className="text-2xl font-bold uppercase">VOID_WAVE</div>
                <div className="text-lg text-[#0ff]">&gt; Gen Waves</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Center Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 min-h-[500px]">
        <SnakeGame />
      </main>

      {/* Right Aside */}
      <aside className="w-full lg:w-80 flex flex-col justify-end shrink-0 z-10">
        <MusicPlayer />
      </aside>
    </div>
  );
}
