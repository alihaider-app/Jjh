import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Languages,
  Subtitles,
  Play,
  Pause,
  RotateCcw,
  Download,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  AlertCircle,
  Volume2,
  VolumeX,
  FileCode,
  Sliders,
  Plus,
} from 'lucide-react';
import { VideoJob, VideoDubbingChunk } from '../types';
import { fetchDubbingJobs, createDubbingJob, playExecutiveSpeech, stopExecutiveSpeech } from '../services/api';

export const LongVideoDubbing: React.FC = () => {
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<'both' | 'dubbing' | 'subtitles'>('both');
  const [isMuted, setIsMuted] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  // New job modal form state
  const [newTitle, setNewTitle] = useState('Global AI & Tech Documentary (1 Hour)');
  const [newDuration, setNewDuration] = useState('01:15:00');
  const [newSourceLang, setNewSourceLang] = useState('English');
  const [newTargetLang, setNewTargetLang] = useState('Urdu');
  const [newMode, setNewMode] = useState<'both' | 'dubbing' | 'subtitles'>('both');

  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const list = await fetchDubbingJobs();
    setJobs(list);
    if (list.length > 0 && !selectedJob) {
      setSelectedJob(list[0]);
    }
  };

  // Interactive real-time playback simulation across dialogue chunks
  useEffect(() => {
    if (isPlaying && selectedJob?.chunks && selectedJob.chunks.length > 0) {
      const currentChunk = selectedJob.chunks[activeChunkIndex];

      // Play vocal speech for current chunk if dubbing mode active
      if (!isMuted && (playbackMode === 'both' || playbackMode === 'dubbing')) {
        playExecutiveSpeech(currentChunk.translatedText, 'Kore', selectedJob.targetLang);
      }

      playbackTimerRef.current = setTimeout(() => {
        if (activeChunkIndex < selectedJob.chunks.length - 1) {
          setActiveChunkIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setActiveChunkIndex(0);
        }
      }, 5000);
    } else {
      stopExecutiveSpeech();
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
    };
  }, [isPlaying, activeChunkIndex, selectedJob, isMuted, playbackMode]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopExecutiveSpeech();
    } else {
      setIsPlaying(true);
    }
  };

  const handleCreateJob = async () => {
    const created = await createDubbingJob({
      title: newTitle,
      duration: newDuration,
      sourceLang: newSourceLang,
      targetLang: newTargetLang,
      mode: newMode,
    });
    setJobs((prev) => [created, ...prev]);
    setSelectedJob(created);
    setActiveChunkIndex(0);
    setShowNewJobModal(false);
  };

  const handleDownloadSrt = () => {
    if (!selectedJob) return;
    const blob = new Blob([selectedJob.subtitlesSrt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedJob.title.replace(/\s+/g, '_')}_${selectedJob.targetLang}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Preset sample videos
  const samplePresets = [
    {
      title: 'Executive Global Strategy Keynote (1 Hour)',
      duration: '01:04:22',
      source: 'English',
      target: 'Urdu',
    },
    {
      title: 'Korean High-Tech Drama Ep 4 (45 Min)',
      duration: '00:45:10',
      source: 'Korean',
      target: 'Urdu',
    },
    {
      title: 'Munich Robotics & Automation Summit (2 Hours)',
      duration: '02:08:45',
      source: 'German',
      target: 'Urdu',
    },
  ];

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setIsPlaying(false);
    stopExecutiveSpeech();
    const created: VideoJob = {
      id: `job-preset-${Date.now()}`,
      title: preset.title,
      duration: preset.duration,
      sourceLang: preset.source,
      targetLang: preset.target,
      mode: 'both',
      status: 'completed',
      progress: 100,
      currentStep: 'Verified & Aligned',
      chunks: [
        {
          id: 1,
          timeRange: '00:00:00,000 --> 00:00:05,000',
          sourceText: `Welcome to our ${preset.source} session on autonomous technologies.`,
          translatedText: `خود مختار ٹیکنالوجی پر ہمارے اس سیشن میں آپ سب کا خیرمقدم ہے۔`,
          speaker: 'Lead Speaker',
          dubbedAudioStatus: 'synced',
        },
        {
          id: 2,
          timeRange: '00:00:05,200 --> 00:00:10,500',
          sourceText: 'We will walk through the multi-agent execution pipeline step-by-step.',
          translatedText: 'ہم قدم بہ قدم ملٹی ایجنٹ کے طریقہ کار کا جائزہ لیں گے۔',
          speaker: 'Lead Speaker',
          dubbedAudioStatus: 'synced',
        },
        {
          id: 3,
          timeRange: '00:00:10,800 --> 00:00:16,000',
          sourceText: 'Notice how background audio is preserved while the dialogue is dubbed naturally.',
          translatedText: 'دیکھیں کہ کس طرح پس منظر کی آواز کو برقرار رکھتے ہوئے قدرتی انداز میں ڈبنگ کی گئی ہے۔',
          speaker: 'Lead Speaker',
          dubbedAudioStatus: 'synced',
        },
      ],
      subtitlesSrt: `1\n00:00:00,000 --> 00:00:05,000\nخود مختار ٹیکنالوجی پر ہمارے اس سیشن میں آپ سب کا خیرمقدم ہے۔\n\n2\n00:00:05,200 --> 00:00:10,500\nہم قدم بہ قدم ملٹی ایجنٹ کے طریقہ کار کا جائزہ لیں گے۔\n\n3\n00:00:10,800 --> 00:00:16,000\nدیکھیں کہ کس طرح پس منظر کی آواز کو برقرار رکھتے ہوئے قدرتی انداز میں ڈبنگ کی گئی ہے۔`,
      createdAt: Date.now(),
    };

    setJobs((prev) => [created, ...prev]);
    setSelectedJob(created);
    setActiveChunkIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              RESUMABLE PIPELINE • 30M / 1H / 2H / 3H
            </span>
            <span className="text-xs text-slate-400">• Video & Dubbing Agent</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Long-Form Video Translation & Neural Dubbing
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Chunk-based parallel architecture. Accurately preserves original dialogue nuances, speaker voice pitch, and background score.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewJobModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            Queue New Video (30m - 3h)
          </button>
        </div>
      </div>

      {/* Preset Media Quick Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">Sample Pipelines:</span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPreset(preset)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-indigo-500/50 transition whitespace-nowrap text-xs font-medium"
          >
            {preset.title} ({preset.duration})
          </button>
        ))}
      </div>

      {/* Main Grid: Player Preview & Timecode Synchronizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Synchronized Video/Audio Player Preview (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Synchronized Media Screen
              </h3>
            </div>
            {selectedJob && (
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                Duration: {selectedJob.duration}
              </span>
            )}
          </div>

          {/* Video Preview Canvas / Mock Screen */}
          <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            {/* Top Overlay: Language badges & Mode */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900/80 text-slate-300 border border-slate-700">
                  Source: {selectedJob?.sourceLang || 'English'}
                </span>
                <span className="text-xs text-slate-500">➔</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700 font-bold">
                  Target: {selectedJob?.targetLang || 'Urdu'}
                </span>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-[10px]">
                <button
                  onClick={() => setPlaybackMode('both')}
                  className={`px-2 py-1 rounded ${
                    playbackMode === 'both' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Dub + Subs
                </button>
                <button
                  onClick={() => setPlaybackMode('dubbing')}
                  className={`px-2 py-1 rounded ${
                    playbackMode === 'dubbing' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Dub Only
                </button>
                <button
                  onClick={() => setPlaybackMode('subtitles')}
                  className={`px-2 py-1 rounded ${
                    playbackMode === 'subtitles' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Subs Only
                </button>
              </div>
            </div>

            {/* Center Animated Visualizer when playing */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-3">
                {isPlaying ? (
                  <Volume2 className="w-8 h-8 text-indigo-400 animate-pulse" />
                ) : (
                  <Play className="w-8 h-8 text-slate-500 ml-1" />
                )}
              </div>
              <div className="text-xs font-semibold text-slate-300 text-center px-4">
                {selectedJob?.title || 'Keynote Presentation'}
              </div>
              <div className="text-[11px] text-indigo-400/80 mt-0.5">
                {isPlaying
                  ? 'Playing Aligned Neural Audio Track (Gemini 3.8 TTS)'
                  : 'Click Play to hear real synchronized Urdu dubbing'}
              </div>
            </div>

            {/* Subtitle Display Overlay (Bottom of Video) */}
            {(playbackMode === 'both' || playbackMode === 'subtitles') && selectedJob?.chunks && (
              <div className="z-10 text-center mb-2">
                <div className="inline-block px-4 py-2 rounded-lg bg-black/90 border border-slate-800 text-amber-300 text-sm md:text-base font-semibold max-w-xl shadow-lg">
                  {selectedJob.chunks[activeChunkIndex]?.translatedText || 'ٹیکنالوجی کی خود مختاری اور ذہانت پر ہمارے عالمی سربراہی اجلاس میں آپ سب کو خوش آمدید۔'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 italic">
                  [{selectedJob.chunks[activeChunkIndex]?.sourceText}]
                </div>
              </div>
            )}

            {/* Bottom Playback Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 z-10 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow"
                  title={isPlaying ? 'Pause' : 'Play synchronized video & audio'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setActiveChunkIndex((prev) =>
                      selectedJob?.chunks ? (prev + 1) % selectedJob.chunks.length : 0
                    );
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                >
                  Next Chunk ➔
                </button>
                <span className="text-[11px] text-slate-400 font-mono">
                  Chunk {activeChunkIndex + 1} of {selectedJob?.chunks?.length || 1}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleDownloadSrt}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 font-medium transition"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  Download .SRT
                </button>
              </div>
            </div>
          </div>

          {/* Job Pipeline Stages Progress */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Resumable Background Job Status</span>
              <span className="text-emerald-400 font-mono font-bold">
                {selectedJob?.progress || 100}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedJob?.progress || 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Timecode Synchronizer & Dialogue Chunks (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Subtitles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Dialogue Segments ({selectedJob?.chunks.length || 0})
                </h3>
              </div>
              <span className="text-[10px] text-teal-400 font-mono">Synced</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {selectedJob?.chunks.map((chunk, idx) => (
                <div
                  key={chunk.id}
                  onClick={() => {
                    setActiveChunkIndex(idx);
                    if (!isMuted && (playbackMode === 'both' || playbackMode === 'dubbing')) {
                      playExecutiveSpeech(chunk.translatedText, 'Kore', selectedJob.targetLang);
                    }
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    activeChunkIndex === idx
                      ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{chunk.timeRange}</span>
                    <span className="text-cyan-400 font-bold">{chunk.speaker}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-1 italic">
                    {chunk.sourceText}
                  </p>
                  <p className="text-amber-200 font-semibold text-xs leading-relaxed">
                    {chunk.translatedText}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright & Media Rights Notice (Section 24) */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Copyright Protocol</strong>: Translation/dubbing does not grant commercial redistribution rights. Processing complies with fair-use and authorized media guidelines.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New Video Queue Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Queue Long Video for Localization
                </h3>
              </div>
              <button
                onClick={() => setShowNewJobModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Video Title / Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Length / Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="00:30:00">30 Minutes</option>
                    <option value="01:00:00">1 Hour</option>
                    <option value="02:00:00">2 Hours</option>
                    <option value="03:00:00">3 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Output Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="both">Subtitles + Dubbing</option>
                    <option value="dubbing">Dubbing Only</option>
                    <option value="subtitles">Subtitles Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Source Language</label>
                  <select
                    value={newSourceLang}
                    onChange={(e) => setNewSourceLang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Korean">Korean (한국어)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="Chinese">Chinese (中文)</option>
                    <option value="French">French (Français)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Target Language</label>
                  <select
                    value={newTargetLang}
                    onChange={(e) => setNewTargetLang(e.target.value)}
                    className="w-full bg-slate-950 border border-indigo-800 rounded-lg p-2 text-indigo-300 font-bold focus:outline-none"
                  >
                    <option value="Urdu">Urdu (اردو)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="English">English</option>
                    <option value="Persian">Persian (فارسی)</option>
                    <option value="Punjabi">Punjabi (پنجابی)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowNewJobModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow"
              >
                Launch Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
