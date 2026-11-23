import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Cpu,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Code2,
  Globe,
  Mail,
  Crown,
  Radio,
  BookOpen,
  Stethoscope,
  Scale,
  Square,
} from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';
import {
  playExecutiveSpeech,
  stopExecutiveSpeech,
  unlockBrowserAudio,
  subscribeSpeechStatus,
} from '../services/api';
import {
  verifyAndRequestMicrophone,
  translateSpeechRecognitionError,
  getSpeechRecognitionConstructor,
} from '../services/audioPermissions';

interface ChatInteractiveHubProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  userProfile: UserProfile;
  voiceAutoPlay: boolean;
  onToggleVoiceAutoPlay: () => void;
}

export const ChatInteractiveHub: React.FC<ChatInteractiveHubProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  userProfile,
  voiceAutoPlay,
  onToggleVoiceAutoPlay,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMicListening, setIsMicListening] = useState(false);
  const [isCheckingMic, setIsCheckingMic] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  // Active speech engine status (queue progress, keep-alive active)
  const [speechStatus, setSpeechStatus] = useState<{
    isSpeaking: boolean;
    currentChunk: number;
    totalChunks: number;
    lang: string;
  }>({
    isSpeaking: false,
    currentChunk: 0,
    totalChunks: 0,
    lang: 'ur-PK',
  });

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to live Speech Status & Keep-Alive Queue progress
  useEffect(() => {
    const unsubscribe = subscribeSpeechStatus((status) => {
      setSpeechStatus(status);
      if (!status.isSpeaking) {
        setCurrentlySpeakingId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, speechStatus.isSpeaking]);

  // Voice speech recognition for Chat input with graceful setup
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        const lang = (userProfile.language || 'urdu').toLowerCase();
        recognition.lang = lang.includes('urdu')
          ? 'ur-PK'
          : lang.includes('hindi')
          ? 'hi-IN'
          : lang.includes('arabic')
          ? 'ar-SA'
          : 'en-US';

        recognition.onstart = () => {
          setIsMicListening(true);
          setIsCheckingMic(false);
          setMicNotice(null);
        };

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setInputText(text);
        };

        recognition.onerror = (event: any) => {
          setIsMicListening(false);
          setIsCheckingMic(false);
          if (event.error === 'no-speech' || event.error === 'aborted') {
            return;
          }
          const errInfo = translateSpeechRecognitionError(event.error);
          if (errInfo.message) {
            setMicNotice(errInfo.message);
          }
        };

        recognition.onend = () => {
          setIsMicListening(false);
          setIsCheckingMic(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('[AI Agent Ali] Speech recognition instantiation error:', err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [userProfile.language]);

  /**
   * Robust toggle for microphone input:
   * 1. Safely checks and requests navigator.mediaDevices.getUserMedia permission
   * 2. Alerts user with clear instructions if blocked in browser settings
   * 3. Prevents "Could not start microphone" crashes and unhandled exceptions
   */
  const toggleMic = async () => {
    unlockBrowserAudio();

    if (isMicListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsMicListening(false);
      return;
    }

    setIsCheckingMic(true);
    setMicNotice(null);

    // 1. Verify real microphone permission and hardware access safely
    const permResult = await verifyAndRequestMicrophone();
    if (!permResult.success) {
      setIsCheckingMic(false);
      setIsMicListening(false);
      setMicNotice(permResult.message || 'Microphone access is unavailable.');
      return;
    }

    // 2. Ensure SpeechRecognition engine is available in this browser
    if (!recognitionRef.current) {
      const SpeechRecognition = getSpeechRecognitionConstructor();
      if (!SpeechRecognition) {
        setIsCheckingMic(false);
        setMicNotice('Speech recognition is not supported in this browser. Please use Chrome, Edge, Safari, or type your message below.');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        const lang = (userProfile.language || 'urdu').toLowerCase();
        recognition.lang = lang.includes('urdu')
          ? 'ur-PK'
          : lang.includes('hindi')
          ? 'hi-IN'
          : lang.includes('arabic')
          ? 'ar-SA'
          : 'en-US';

        recognition.onstart = () => {
          setIsMicListening(true);
          setIsCheckingMic(false);
          setMicNotice(null);
        };
        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setInputText(text);
        };
        recognition.onerror = (event: any) => {
          setIsMicListening(false);
          setIsCheckingMic(false);
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            const errInfo = translateSpeechRecognitionError(event.error);
            if (errInfo.message) setMicNotice(errInfo.message);
          }
        };
        recognition.onend = () => {
          setIsMicListening(false);
          setIsCheckingMic(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        setIsCheckingMic(false);
        setMicNotice('Failed to initialize speech recognizer. Please type your query.');
        return;
      }
    }

    // 3. Start speech recognition safely
    try {
      recognitionRef.current.start();
    } catch (err: any) {
      setIsCheckingMic(false);
      if (err?.name === 'InvalidStateError') {
        // Recognition was in starting/aborting state; reset and retry once
        try {
          recognitionRef.current.abort();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (retryErr: any) {
              setMicNotice('Microphone session reset. Please tap the mic button once more to speak.');
            }
          }, 120);
        } catch (_) {
          setMicNotice('Microphone session reset. Please tap the mic button once more to speak.');
        }
      } else {
        setMicNotice('Could not start microphone. Please verify microphone access in browser settings.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    unlockBrowserAudio();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeech = (msgId: string, speechText: string) => {
    unlockBrowserAudio();
    if (currentlySpeakingId === msgId || (speechStatus.isSpeaking && currentlySpeakingId === msgId)) {
      stopExecutiveSpeech();
      setCurrentlySpeakingId(null);
    } else {
      stopExecutiveSpeech();
      setCurrentlySpeakingId(msgId);
      playExecutiveSpeech(
        speechText,
        userProfile.voicePersona,
        userProfile.language,
        () => {
          setCurrentlySpeakingId(null);
        }
      );
    }
  };

  const handleStopActiveVoice = () => {
    stopExecutiveSpeech();
    setCurrentlySpeakingId(null);
  };

  const quickPrompts = [
    {
      label: userProfile.isFounder ? 'Alibaba ➔ Amazon Margin' : 'Amazon FBA Study',
      prompt: 'Alibaba se MagSafe power bank source karke Amazon FBA par sell karne ka unit economics aur net profit calculate karo.',
      icon: TrendingUp,
    },
    {
      label: 'Universal Science Brain',
      prompt: 'Universe ki expansion aur Dark Matter ka kya connection hai? Explain with modern astrophysics principles.',
      icon: Globe,
    },
    {
      label: 'Full-Stack Code',
      prompt: 'Write an asynchronous worker queue in TypeScript with exponential backoff and error circuit breakers.',
      icon: Code2,
    },
    {
      label: 'Executive Email Draft',
      prompt: 'Draft an executive B2B partnership proposal email with strict quality deliverables and escrow terms.',
      icon: Mail,
    },
    {
      label: 'Corporate Legal Advice',
      prompt: 'What are the essential risk indemnification clauses needed in an international software development contract?',
      icon: Scale,
    },
    {
      label: 'Educational Tutor',
      prompt: 'Explain the difference between Special Relativity and General Relativity with intuitive real-world examples.',
      icon: BookOpen,
    },
  ];

  return (
    <div className="flex flex-col h-[650px] bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl animate-fadeIn">
      {/* Top Header of Chat Hub */}
      <div className="px-5 py-3.5 border-b border-slate-800/90 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 font-black text-xs">
            ALI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white tracking-wide">
                UNIVERSAL STREAM CHAT
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/60">
                ACTIVE SESSION
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cross-domain Universal Knowledge & Multi-Agent Execution Stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Speaking Status & Stop Button */}
          {speechStatus.isSpeaking && (
            <button
              onClick={handleStopActiveVoice}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-bold transition cursor-pointer shadow-sm animate-pulse"
              title="Stop Voice Playback"
            >
              <Square className="w-3 h-3 fill-rose-300 text-rose-300" />
              <span>Stop Voice</span>
            </button>
          )}

          {/* Vocal TTS Auto-Play Switcher */}
          <button
            onClick={onToggleVoiceAutoPlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              voiceAutoPlay
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle vocal audio playback after every AI answer"
          >
            {voiceAutoPlay ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">Voice TTS:</span>
            <span>{voiceAutoPlay ? 'ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-sm font-bold text-white">
                {userProfile.isFounder
                  ? 'Ji Boss, batayein main aap ke liye kya kaam kar sakta hoon?'
                  : `Khush Amdeed, ${userProfile.name} ji!`}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aap mujh se dunya ka koi bhi sawal pooch sakte hain—Science, History, Coding, Alibaba sourcing, TikTok scripts ya Daily Human tasks in any language.
              </p>
            </div>

            {/* Quick Starter Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-2xl mt-2 text-left">
              {quickPrompts.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      unlockBrowserAudio();
                      onSendMessage(item.prompt);
                    }}
                    className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                          {item.label}
                        </span>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition" />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  msg.sender === 'user'
                    ? msg.isFounder
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-indigo-600 text-white'
                    : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                }`}
              >
                {msg.sender === 'user' ? (
                  msg.isFounder ? (
                    <Crown className="w-4 h-4 fill-slate-950" />
                  ) : (
                    <User className="w-4 h-4" />
                  )
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800/80 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Spoken Text Quote if AI */}
                {msg.sender === 'ali' && (
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800 text-[11px] gap-2">
                    <div className="text-cyan-300 italic font-semibold truncate pr-2">
                      “{msg.speechText ? msg.speechText.slice(0, 110) + '...' : msg.text.slice(0, 110) + '...'}”
                    </div>
                    <button
                      onClick={() => handleToggleSpeech(msg.id, msg.speechText || msg.text)}
                      className={`p-1.5 rounded-lg flex items-center gap-1 shrink-0 transition cursor-pointer ${
                        currentlySpeakingId === msg.id || (speechStatus.isSpeaking && currentlySpeakingId === msg.id)
                          ? 'bg-cyan-500 text-slate-950 font-bold animate-pulse'
                          : 'bg-cyan-950 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900'
                      }`}
                      title={currentlySpeakingId === msg.id ? 'Stop Voice' : 'Read Response Out Loud (TTS)'}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase font-bold">
                        {currentlySpeakingId === msg.id ? 'Speaking...' : 'Listen'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Formatted Text Content */}
                <div className="space-y-2 whitespace-pre-wrap font-sans">
                  {msg.text.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h4 key={idx} className="text-sm font-extrabold text-white mt-1 mb-0.5">
                          {paragraph.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('#### ')) {
                      return (
                        <h5 key={idx} className="text-xs font-bold text-cyan-300 mt-1">
                          {paragraph.replace('#### ', '')}
                        </h5>
                      );
                    }
                    return (
                      <p key={idx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Multi-Agent Action Steps if present */}
                {msg.actionPlan && msg.actionPlan.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] space-y-1">
                    <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      Specialist Actions Orchestrated:
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actionPlan.map((step) => (
                        <span
                          key={step.step}
                          className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <strong>{step.agent}:</strong> {step.action}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Footer for AI message */}
                {msg.sender === 'ali' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-end gap-2 text-[10px] text-slate-400">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:text-white transition cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Processing Indicator with Audio Equalizer Animation */}
        {isProcessing && (
          <div className="flex items-center gap-3 text-xs text-cyan-300 bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 w-fit animate-pulse shadow-lg">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            <span>AI Agent Ali is orchestrating Universal Knowledge & Specialist Agents...</span>
            <div className="flex items-center gap-0.5 ml-2">
              <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-4 bg-cyan-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-2 bg-cyan-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mic Permission / Status In-App Notice with Close Button */}
      {micNotice && (
        <div className="px-4 py-2 bg-gradient-to-r from-amber-950/90 to-amber-900/90 border-t border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 animate-fadeIn shadow-inner">
          <div className="flex items-center gap-2 flex-1">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">⚠️</span>
            <span className="leading-snug">{micNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setMicNotice(null)}
            className="text-amber-400 hover:text-white px-2 py-1 rounded bg-amber-800/40 hover:bg-amber-800 text-[11px] font-bold transition cursor-pointer shrink-0"
            title="Dismiss notice"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Active "Speaking..." Status Indicator & Stop Voice Control */}
      {speechStatus.isSpeaking && (
        <div className="px-4 py-2 bg-cyan-950/80 border-t border-cyan-500/40 flex items-center justify-between text-xs text-cyan-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold">Speaking...</span>
            <span className="text-[11px] text-cyan-400/80 font-mono">
              (Sentence {speechStatus.currentChunk} of {speechStatus.totalChunks || 1} • Keep-Alive Loop Active)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Audio Waveform Animation */}
            <div className="flex items-center gap-1 h-4">
              <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-cyan-300 rounded-full animate-bounce [animation-delay:-0.2s]" />
              <span className="w-1 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.4s]" />
              <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
              <span className="w-1 h-3 bg-cyan-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
            {/* Stop Voice button */}
            <button
              onClick={handleStopActiveVoice}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition cursor-pointer shadow-sm active:scale-95"
              title="Stop speech playback immediately"
            >
              <Square className="w-3 h-3 fill-white" />
              <span>Stop Voice</span>
            </button>
          </div>
        </div>
      )}

      {/* Audio Visualizer Feedback Bar when Mic is active */}
      {isMicListening && (
        <div className="px-4 py-2 bg-rose-950/40 border-t border-rose-500/30 flex items-center justify-between text-xs text-rose-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold">Listening to Voice Input...</span>
          </div>
          {/* Animated Equalizer Waveform */}
          <div className="flex items-center gap-1 h-4">
            <span className="w-1 h-3 bg-rose-400 rounded-full animate-bounce" />
            <span className="w-1 h-4 bg-rose-300 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.4s]" />
            <span className="w-1 h-4 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
            <span className="w-1 h-3 bg-rose-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Mic STT Button */}
          <button
            type="button"
            onClick={toggleMic}
            disabled={isCheckingMic}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center ${
              isMicListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-md shadow-rose-500/30'
                : isCheckingMic
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-900 text-slate-400 hover:text-cyan-400 border-slate-800 hover:border-slate-700'
            }`}
            title={
              isCheckingMic
                ? 'Checking microphone permissions...'
                : isMicListening
                ? 'Listening... Click to Stop'
                : 'Voice Input (Click to speak)'
            }
          >
            {isCheckingMic ? (
              <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : isMicListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              userProfile.isFounder
                ? 'Boss, yahan sawal likhein ya microphone se batayein (Science, Code, Amazon, Dubbing)...'
                : `${userProfile.name} ji, apna sawal yahan likhein ya microphone use karein...`
            }
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer shadow-md shadow-cyan-600/20 active:scale-[0.98]"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
