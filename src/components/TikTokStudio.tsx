import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Copy,
  Check,
  Smartphone,
  Eye,
  Hash,
  Share2,
  Clock,
  Layers,
  Flame,
  Volume2,
} from 'lucide-react';

export const TikTokStudio: React.FC = () => {
  const [topic, setTopic] = useState('How Autonomous AI Agents Replace 10-Person Teams');
  const [hookStyle, setHookStyle] = useState<'controversial' | 'pattern_interrupt' | 'urgent_secret'>('pattern_interrupt');
  const [copied, setCopied] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishConfirmed, setPublishConfirmed] = useState(false);

  const hookOptions = {
    pattern_interrupt: {
      visual: 'Quick camera snap zoom + red warning overlay on laptop screen',
      spoken: '“Agar aap 2026 mein bhi repetitive emails aur calculations haath se kar rahe hain, toh aap apna karobar duba rahe hain!”',
      textOverlay: 'STOP WASTING 4 HOURS DAILY 🛑',
    },
    controversial: {
      visual: 'Holding up a blank sheet of paper and tearing it in half',
      spoken: '“Your 5-member marketing department can now be replaced by one single autonomous agent loop.”',
      textOverlay: 'THE UNCOMFORTABLE TRUTH ⚠️',
    },
    urgent_secret: {
      visual: 'Whispering close to the microphone with confidential lighting',
      spoken: '“Ye ek aisi AI trick hai jo top 1% Amazon sellers kisi ko nahi batate…”',
      textOverlay: 'TOP SECRET WORKFLOW 🤫',
    },
  };

  const currentHook = hookOptions[hookStyle];

  const scenes = [
    {
      time: '0:00 - 0:03',
      scene: 'The Hook',
      visual: currentHook.visual,
      audio: currentHook.spoken,
      onScreenText: currentHook.textOverlay,
    },
    {
      time: '0:04 - 0:11',
      scene: 'The Agitation',
      visual: 'Rapid-fire b-roll of endless spreadsheets, late-night emails, and supplier confusion.',
      audio: '“Daily tasks aapka time khaa jaate hain aur aap growth strategy par dhyan nahi de paate.”',
      onScreenText: 'TIRED OF MICRO-MANAGING? 📉',
    },
    {
      time: '0:12 - 0:22',
      scene: 'The Solution (AI Agent Ali)',
      visual: 'Screen capture of AI Agent Ali coordinating Business Agent + Video Dubbing + Sourcing in parallel.',
      audio: '“AI Agent Ali ko sirf apna goal batao. Ye khud Alibaba sourcing karta hai, Amazon profit margins nikalta hai aur video content tayyar karta hai.”',
      onScreenText: 'AUTONOMOUS MULTI-AGENT WORKFORCE ⚡',
    },
    {
      time: '0:23 - 0:30',
      scene: 'Call to Action (CTA)',
      visual: 'Clean portrait pointing down towards the comment section with glowing neon arrow.',
      audio: '“Agar aapko complete executive blueprint chahiye, toh niche comment karein ‘ALI’ aur main aapko direct link bhej dunga!”',
      onScreenText: 'COMMENT “ALI” BELOW 🚀',
    },
  ];

  const hashtags = ['#AIAgentAli', '#AIWorkforce', '#Entrepreneurship', '#TikTokViral', '#BusinessHacks', '#UrduTech', '#AmazonFBA'];

  const copyFullScript = () => {
    const formatted = `TIKTOK / REELS PRODUCTION SCRIPT
Topic: ${topic}
Style: ${hookStyle}

FIRST-3-SECOND HOOK:
Visual: ${currentHook.visual}
Spoken: ${currentHook.spoken}
Text Overlay: ${currentHook.textOverlay}

SCENE BREAKDOWN:
${scenes
  .map(
    (s) => `[${s.time}] ${s.scene}
Visual: ${s.visual}
Voiceover: ${s.audio}
On-Screen: ${s.onScreenText}
`
  )
  .join('\n')}

HASHTAGS:
${hashtags.join(' ')}
`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-pink-950/40 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              FIRST-3-SECOND RETENTION HOOKS
            </span>
            <span className="text-xs text-slate-400">• Social & TikTok Agent</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            High-Retention Short-Form Content Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Engineered pattern-interrupts, scene-by-scene voiceover pacing, and verified publication guardrails.
          </p>
        </div>

        <button
          onClick={copyFullScript}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition border border-slate-700"
        >
          {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Script Copied!' : 'Copy Full Script'}
        </button>
      </div>

      {/* Main Grid: Mobile Preview Frame & Scene Storyboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mobile 9:16 Preview (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                9:16 Vertical Preview
              </h3>
            </div>
            <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" /> 94% Retention Score
            </span>
          </div>

          {/* Simulated Mobile Mockup */}
          <div className="relative w-64 aspect-[9/16] rounded-3xl bg-slate-950 border-4 border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            {/* Top Bar inside Phone */}
            <div className="flex justify-between items-center text-[10px] text-white/70 z-10">
              <span className="font-bold">Following | For You</span>
              <span className="px-1.5 py-0.5 rounded bg-black/60 text-[8px]">00:30</span>
            </div>

            {/* Pattern Interrupt Hook on Screen */}
            <div className="my-auto text-center z-10 px-2">
              <div className="inline-block bg-yellow-400 text-black font-black text-xs px-2.5 py-1 rounded shadow-lg transform -rotate-2 mb-2">
                {currentHook.textOverlay}
              </div>
              <p className="text-[11px] text-white font-bold drop-shadow leading-snug">
                {currentHook.spoken}
              </p>
            </div>

            {/* Bottom Details & UI */}
            <div className="z-10 space-y-2">
              <div className="text-[11px] font-bold text-white">@AIAgentAli_Official</div>
              <p className="text-[9px] text-slate-300 line-clamp-2">
                Stop doing manual work! Full executive multi-agent system breakdown. #AIAgentAli #Automation
              </p>
              <div className="flex items-center gap-1 text-[9px] text-cyan-300">
                <Volume2 className="w-3 h-3" /> Original Sound - AI Agent Ali Voice
              </div>
            </div>

            {/* Side Action Icons inside Phone */}
            <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3 text-white text-[10px] z-10">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center">❤️</div>
                <span className="text-[9px]">48.2k</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center">💬</div>
                <span className="text-[9px]">1.8k</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center">🔖</div>
                <span className="text-[9px]">12k</span>
              </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-slate-950/80 to-black pointer-events-none" />
          </div>

          {/* Hook Style Selector */}
          <div className="w-full mt-4 space-y-1">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Select 3-Second Hook Angle:
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['pattern_interrupt', 'controversial', 'urgent_secret'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setHookStyle(style)}
                  className={`p-1.5 rounded-lg text-[10px] font-bold capitalize transition ${
                    hookStyle === style
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {style.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scene Storyboard & Direction (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Scene-by-Scene Production Storyboard (30s)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Total Duration: 30 Seconds</span>
            </div>

            <div className="space-y-3">
              {scenes.map((scene, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-bold border border-slate-800">
                        {scene.time}
                      </span>
                      <span className="text-xs font-bold text-white">{scene.scene}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      Overlay: {scene.onScreenText}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-2">
                    <div className="text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Visual Direction
                      </span>
                      {scene.visual}
                    </div>
                    <div className="text-rose-200 bg-rose-950/20 p-2 rounded-lg border border-rose-900/30">
                      <span className="text-[10px] uppercase font-bold text-rose-400 block">
                        Voiceover (Spoken)
                      </span>
                      {scene.audio}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hashtag Cloud */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 flex-wrap">
              <Hash className="w-4 h-4 text-cyan-400 shrink-0" />
              {hashtags.map((h, i) => (
                <span
                  key={i}
                  className="text-xs font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Publication Guardrail (Section 20: Never claim content posted without confirmation) */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <span className="font-bold text-white">Publishing Safety:</span> Content preview must be verified before deploying to connected TikTok or Instagram account.
            </div>
            <button
              onClick={() => setShowPublishModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/20 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              Publish Preview & Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Publish Guardrail Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Social Channel Publishing Guardrail
              </h3>
              <button onClick={() => setShowPublishModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="my-4 text-xs text-slate-300 space-y-2">
              <p>Review final media bundle before dispatch:</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div><strong>Target Platform:</strong> TikTok & Reels (9:16 Video)</div>
                <div><strong>Duration:</strong> 30 Seconds</div>
                <div><strong>Status:</strong> Ready for scheduled staging</div>
                <div className="text-amber-400"><strong>Notice:</strong> Ali never claims content was posted until API confirms handshake.</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPublishConfirmed(true);
                  setTimeout(() => {
                    setShowPublishModal(false);
                    setPublishConfirmed(false);
                  }, 1500);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
              >
                {publishConfirmed ? 'Authorized & Queued ✅' : 'Confirm Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
