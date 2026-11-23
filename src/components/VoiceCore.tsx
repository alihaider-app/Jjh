import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Square, Radio, AlertCircle } from 'lucide-react';
import { VoiceState, UserProfile } from '../types';
import { stopExecutiveSpeech, unlockBrowserAudio } from '../services/api';
import {
  verifyAndRequestMicrophone,
  translateSpeechRecognitionError,
  getSpeechRecognitionConstructor,
} from '../services/audioPermissions';

interface VoiceCoreProps {
  voiceState: VoiceState;
  onSendCommand: (command: string) => void;
  activeTaskText: string;
  userProfile: UserProfile;
  isProcessing: boolean;
}

export const VoiceCore: React.FC<VoiceCoreProps> = ({
  voiceState,
  onSendCommand,
  activeTaskText,
  userProfile,
  isProcessing,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isCheckingMic, setIsCheckingMic] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState<number[]>(new Array(20).fill(8));

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Setup Web Speech API SpeechRecognition safely without re-triggering on every transcript character
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        const lang = userProfile.language.toLowerCase();
        recognition.lang = lang.includes('urdu')
          ? 'ur-PK'
          : lang.includes('hindi')
          ? 'hi-IN'
          : lang.includes('arabic')
          ? 'ar-SA'
          : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setIsCheckingMic(false);
          setMicError(null);
        };

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          transcriptRef.current = text;
          setTranscript(text);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setIsCheckingMic(false);
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            const err = translateSpeechRecognitionError(event.error);
            if (err.message) {
              setMicError(err.message);
            }
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setIsCheckingMic(false);
          cleanupAudioAnalyser();
          const captured = transcriptRef.current.trim();
          if (captured) {
            onSendCommand(captured);
            transcriptRef.current = '';
            setTranscript('');
          }
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('[AI Agent Ali] Speech recognition init error:', e);
      }
    }

    return () => {
      cleanupAudioAnalyser();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [userProfile.language, onSendCommand]);

  // Real Web Audio API stream analyzer for live waveform visualization
  const startAudioAnalyser = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        startSyntheticWave();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const renderFrame = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const levels = [];
        for (let i = 0; i < 20; i++) {
          const val = dataArray[i % dataArray.length] || 0;
          levels.push(Math.max(6, Math.floor((val / 255) * 44) + 6));
        }
        setAudioLevel(levels);
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      };

      renderFrame();
    } catch (err) {
      startSyntheticWave();
    }
  };

  const startSyntheticWave = () => {
    const updateWave = () => {
      setAudioLevel((prev) =>
        prev.map(() => Math.floor(Math.random() * 32) + 8)
      );
      animationFrameRef.current = requestAnimationFrame(updateWave);
    };
    animationFrameRef.current = requestAnimationFrame(updateWave);
  };

  const cleanupAudioAnalyser = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(new Array(20).fill(8));
  };

  // Synthetic wave when Ali is speaking
  useEffect(() => {
    if (voiceState === 'speaking') {
      const interval = setInterval(() => {
        setAudioLevel((prev) =>
          prev.map(() => Math.floor(Math.random() * 36) + 10)
        );
      }, 100);
      return () => clearInterval(interval);
    } else if (!isListening) {
      setAudioLevel(new Array(20).fill(8));
    }
  }, [voiceState, isListening]);

  // Tactile chime for mic activation
  const playChime = (isStart: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(isStart ? 440 : 880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isStart ? 880 : 440, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  };

  const toggleListening = async () => {
    unlockBrowserAudio();

    if (isListening) {
      playChime(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      cleanupAudioAnalyser();
      const captured = transcriptRef.current.trim();
      if (captured) {
        onSendCommand(captured);
        transcriptRef.current = '';
        setTranscript('');
      }
    } else {
      transcriptRef.current = '';
      setTranscript('');
      stopExecutiveSpeech();
      setIsCheckingMic(true);
      setMicError(null);

      // Safe permission verification with getUserMedia
      const permCheck = await verifyAndRequestMicrophone();
      setIsCheckingMic(false);

      if (!permCheck.success) {
        setIsListening(false);
        setMicError(permCheck.message || 'Microphone access is unavailable.');
        return;
      }

      playChime(true);
      setIsListening(true);
      await startAudioAnalyser();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e: any) {
          if (e?.name === 'InvalidStateError') {
            try {
              recognitionRef.current.abort();
              setTimeout(() => {
                try {
                  recognitionRef.current.start();
                } catch (_) {}
              }, 100);
            } catch (_) {}
          } else {
            console.warn('[AI Agent Ali] Mic start error:', e);
          }
        }
      } else {
        const SpeechRecognition = getSpeechRecognitionConstructor();
        if (SpeechRecognition) {
          try {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = userProfile.language.toLowerCase().includes('urdu') ? 'ur-PK' : 'en-US';
            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event: any) => {
              let text = '';
              for (let i = 0; i < event.results.length; ++i) {
                text += event.results[i][0].transcript;
              }
              transcriptRef.current = text;
              setTranscript(text);
            };
            recognition.onerror = (ev: any) => {
              setIsListening(false);
              if (ev.error !== 'no-speech' && ev.error !== 'aborted') {
                const tr = translateSpeechRecognitionError(ev.error);
                if (tr.message) setMicError(tr.message);
              }
            };
            recognition.onend = () => {
              setIsListening(false);
              cleanupAudioAnalyser();
              const captured = transcriptRef.current.trim();
              if (captured) {
                onSendCommand(captured);
                transcriptRef.current = '';
                setTranscript('');
              }
            };
            recognitionRef.current = recognition;
            recognition.start();
          } catch (_) {
            setMicError('Speech recognition engine could not start.');
          }
        } else {
          // Fallback message for browsers without native speech recognition
          setTranscript(
            userProfile.isFounder
              ? 'Ji Boss, aawaz sun raha hoon... (Tap Stop & Send)'
              : `${userProfile.name} ji, aawaz sun raha hoon...`
          );
        }
      }
    }
  };

  const handleStopSpeaking = () => {
    stopExecutiveSpeech();
  };

  const quickPrompts = [
    {
      label: 'Alibaba ➔ Amazon Sourcing',
      urdu: 'Alibaba se product research karo jo Amazon par profit ke saath sell kiya ja sake',
      icon: '📊',
    },
    {
      label: '1-Hour Video Dubbing',
      urdu: 'Is English video ko Urdu mein translate aur dub karo',
      icon: '🎙️',
    },
    {
      label: 'TikTok Viral Hook Script',
      urdu: 'TikTok video script ready karo with first-3-second retention hook',
      icon: '🎬',
    },
    {
      label: 'Build Web App',
      urdu: 'AI Agent Ali, mujhe ye app bana do',
      icon: '💻',
    },
    {
      label: 'Client Message to Video',
      urdu: 'Ye client message dekho aur is topic par video plan ready karo',
      icon: '✉️',
    },
    {
      label: 'Supplier PO Authorization',
      urdu: 'Supplier inventory advance payment of $2,500 review and authorize karo',
      icon: '🛡️',
    },
  ];

  const getStatusBadge = () => {
    switch (voiceState) {
      case 'listening':
        return { text: 'Listening to your voice...', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse' };
      case 'understanding':
        return { text: 'Understanding Executive Goal...', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' };
      case 'planning':
        return { text: 'Executive Planning & Agent Selection...', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40 animate-pulse' };
      case 'working':
        return { text: 'Specialist Workforce Executing Work...', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
      case 'waiting_for_approval':
        return { text: 'WAITING FOR BOSS APPROVAL', color: 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-bounce' };
      case 'speaking':
        return { text: 'AI Agent Ali is Speaking...', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 animate-pulse' };
      case 'completed':
        return { text: 'Mission Verified & Delivered', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' };
      default:
        return {
          text: userProfile.isFounder ? 'Ready for your command, Boss' : `Ready for ${userProfile.name}`,
          color: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 p-6 shadow-2xl backdrop-blur-xl">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Status indicator */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border uppercase mb-3 ${statusBadge.color}`}>
          <span className="w-2 h-2 rounded-full bg-current animate-ping" />
          {statusBadge.text}
        </div>

        {/* Dynamic greeting for Boss or Named User */}
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">
          {userProfile.isFounder ? (
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              “Ji Boss, batayein aaj kya kaam karna hai?”
            </span>
          ) : (
            <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              “{userProfile.name} ji, kaise hain aap? Aaj kya kaam karna hai?”
            </span>
          )}
        </h2>
        <p className="text-xs text-slate-400 max-w-lg mb-6">
          Voice-First Executive AI System • Tell Ali what result is wanted, the autonomous workforce manages the intermediate work.
        </p>

        {/* Microphone Permission Warning / Notice */}
        {micError && (
          <div className="w-full max-w-md my-2 p-3 rounded-xl bg-gradient-to-r from-amber-950/90 to-amber-900/90 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
            <div className="flex items-center gap-2 text-left flex-1">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="leading-snug">{micError}</span>
            </div>
            <button
              onClick={() => setMicError(null)}
              className="text-amber-400 hover:text-white px-2 py-1 rounded bg-amber-800/50 hover:bg-amber-800 text-[11px] font-bold transition shrink-0 cursor-pointer"
            >
              ✕ Dismiss
            </button>
          </div>
        )}

        {/* The Big Tactile Microphone Centerpiece */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Outer Pulsing Rings */}
          {(isListening || voiceState === 'speaking') && (
            <>
              <div className="absolute w-44 h-44 rounded-full border border-cyan-500/30 animate-ping opacity-30" />
              <div className="absolute w-36 h-36 rounded-full bg-cyan-500/10 animate-pulse" />
            </>
          )}

          {/* Core Microphone Button with audio unlock */}
          <button
            onPointerDown={() => unlockBrowserAudio()}
            onTouchStart={() => unlockBrowserAudio()}
            onClick={toggleListening}
            disabled={(isProcessing && !isListening) || isCheckingMic}
            className={`group relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
              isListening
                ? 'bg-gradient-to-tr from-rose-600 to-red-500 ring-4 ring-rose-400/50 scale-105'
                : isCheckingMic
                ? 'bg-gradient-to-tr from-amber-600 to-yellow-600 ring-4 ring-amber-400/50 animate-pulse'
                : voiceState === 'speaking'
                ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 ring-4 ring-cyan-400/50 animate-pulse'
                : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 hover:scale-105 ring-2 ring-cyan-500/30 active:scale-95'
            }`}
            title={
              isCheckingMic
                ? 'Checking microphone permissions...'
                : isListening
                ? 'Click to stop listening'
                : 'Click to speak to AI Agent Ali'
            }
          >
            {isCheckingMic ? (
              <span className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : isListening ? (
              <MicOff className="w-10 h-10 text-white animate-bounce" />
            ) : voiceState === 'speaking' ? (
              <Volume2 className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Mic className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/90 mt-1">
              {isCheckingMic
                ? 'Checking...'
                : isListening
                ? 'Stop'
                : voiceState === 'speaking'
                ? 'Ali Speaking'
                : 'Speak'}
            </span>
          </button>
        </div>

        {/* Live Audio Equalizer Waveform */}
        <div className="flex items-center justify-center gap-1.5 h-12 my-2 px-4 py-1 rounded-xl bg-slate-950/40 border border-slate-800/60">
          {audioLevel.map((height, idx) => (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-75 ${
                isListening
                  ? 'bg-gradient-to-t from-rose-600 to-emerald-400'
                  : voiceState === 'speaking'
                  ? 'bg-gradient-to-t from-indigo-600 to-cyan-400'
                  : 'bg-slate-700'
              }`}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>

        {/* Interim Voice Transcript or Active Status */}
        <div className="min-h-12 flex items-center justify-center px-4 py-2 mt-1 rounded-lg bg-slate-950/70 border border-slate-800/80 w-full max-w-xl text-center">
          {isListening ? (
            <p className="text-sm font-medium text-emerald-300 italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {transcript || 'Listening... Speak in Urdu, Hindi, English, or your preferred language'}
            </p>
          ) : voiceState === 'speaking' ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-indigo-300 font-medium">Ali is speaking audio response</span>
              <button
                onClick={handleStopSpeaking}
                className="px-2.5 py-1 text-[11px] font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded border border-rose-500/40 flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                Mute Voice
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 truncate">
              {activeTaskText || 'Press microphone or select a command below to deploy specialist agents.'}
            </p>
          )}
        </div>

        {/* Stop listening control */}
        {isListening && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={toggleListening}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition shadow cursor-pointer"
            >
              Stop Listening & Send
            </button>
          </div>
        )}

        {/* Platform Transparency Notice */}
        <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>Continuous background wake-word requires native Android service; browser uses tap-to-talk microphone activation.</span>
        </div>
      </div>

      {/* Quick Voice Command Triggers */}
      <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Executive Voice Directives (1-Click Run)
          </span>
          <span className="text-[11px] text-slate-500">Multilingual: Urdu • English • Hindi • Arabic</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onPointerDown={() => unlockBrowserAudio()}
              onClick={() => {
                unlockBrowserAudio();
                onSendCommand(item.urdu);
              }}
              disabled={isProcessing}
              className="text-left px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 group active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {item.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                “{item.urdu}”
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
