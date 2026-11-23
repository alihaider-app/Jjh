import React, { useState } from 'react';
import {
  ShieldCheck,
  Crown,
  User,
  Key,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  playExecutiveSpeech,
  getLocalFounderConfig,
  saveLocalFounderConfig,
  unlockBrowserAudio,
} from '../services/api';

interface AuthSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserProfile, greetingMessage: string) => void;
  currentProfile: UserProfile;
  onOpenFounderSetup?: () => void;
}

export const AuthSignInModal: React.FC<AuthSignInModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentProfile,
  onOpenFounderSetup,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = (inputName: string, inputEmail: string, inputPin?: string) => {
    unlockBrowserAudio();
    const cleanEmail = (inputEmail || '').toLowerCase().trim();
    const cleanName = (inputName || '').trim();
    const cleanPin = (inputPin || '').trim();

    // Check dynamic founder authority configuration
    const localFounder = getLocalFounderConfig();
    const registeredEmail = (localFounder?.email || 'ah6304993@gmail.com').toLowerCase();
    const registeredPin = localFounder?.pin || '7860';
    const registeredName = localFounder?.name || 'Ali Haider';

    // Strictly match registered Founder credentials
    const isFounder =
      (cleanEmail && cleanEmail === registeredEmail) ||
      (cleanPin && cleanPin === registeredPin) ||
      (cleanEmail === 'ah6304993@gmail.com' && (!cleanPin || cleanPin === '7860' || cleanPin === registeredPin));

    let updatedProfile: UserProfile;
    let spokenGreeting = '';
    let displayGreeting = '';

    if (isFounder) {
      updatedProfile = {
        name: cleanName.toLowerCase().includes('ali') ? 'Boss (Ali Haider)' : 'Boss',
        email: cleanEmail || 'ah6304993@gmail.com',
        role: 'founder',
        isFounder: true,
        language: currentProfile.language || 'Urdu',
        voicePersona: currentProfile.voicePersona || 'Kore',
        workingStyle: 'executive',
        plan: '$0 Lifetime Founder Plan',
        currency: 'USD',
        authPin: cleanPin || '7860',
      };

      spokenGreeting = 'Ji Boss, batayein main aap ke liye kya kaam kar sakta hoon?';
      displayGreeting = '“Ji Boss, batayein main aap ke liye kya kaam kar sakta hoon?”';

      // Keep localStorage in sync immediately
      saveLocalFounderConfig({
        email: updatedProfile.email,
        pin: updatedProfile.authPin || '7860',
        name: updatedProfile.name,
        isConfigured: true,
      });
    } else {
      const userName = cleanName || 'Guest User';
      updatedProfile = {
        name: userName,
        email: cleanEmail || `${userName.toLowerCase().replace(/\s+/g, '')}@workspace.com`,
        role: 'standard',
        isFounder: false,
        language: currentProfile.language || 'Urdu',
        voicePersona: currentProfile.voicePersona || 'Zephyr',
        workingStyle: 'direct',
        plan: 'Standard Plan (Isolated)',
        currency: 'USD',
        authPin: cleanPin,
      };

      spokenGreeting = `${userName} ji, kaise hain aap? Aaj AI Agent Ali aap ke liye kya kaam kar sakta hai?`;
      displayGreeting = `“${userName} ji, kaise hain aap? Aaj kya kaam karna hai?”`;
    }

    setStatusMessage(`Authenticated as ${isFounder ? 'Founder (Boss)' : updatedProfile.name}`);

    // Auto-trigger vocal greeting asynchronously
    try {
      playExecutiveSpeech(spokenGreeting, updatedProfile.voicePersona, updatedProfile.language);
    } catch (_) {}

    // Immediate transition without freeze
    onLogin(updatedProfile, displayGreeting);
    onClose();
  };

  const handleApplyPreset = () => {
    setName('Ali Haider');
    setEmail('ah6304993@gmail.com');
    setPin('7860');
  };

  const handleEnterBossModeDirect = () => {
    setName('Ali Haider');
    setEmail('ah6304993@gmail.com');
    setPin('7860');
    handleSignIn('Ali Haider', 'ah6304993@gmail.com', '7860');
  };

  const handleQuickLogin = (role: 'boss' | 'hassan' | 'zainab') => {
    if (role === 'boss') {
      handleEnterBossModeDirect();
    } else if (role === 'hassan') {
      setName('Hassan');
      setEmail('hassan@example.com');
      setPin('');
      handleSignIn('Hassan', 'hassan@example.com');
    } else {
      setName('Zainab');
      setEmail('zainab@techcorp.io');
      setPin('');
      handleSignIn('Zainab', 'zainab@techcorp.io');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
              ALI
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Account Sign-In & Security Gate
              </h3>
              <p className="text-[11px] text-slate-400">
                AI Agent Ali Tenant Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 1-Click Preset Bar */}
        <div className="mt-3 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
          <span className="text-amber-200 text-[11px] flex items-center gap-1.5 truncate">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            Preset: ah6304993@gmail.com / 7860
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleApplyPreset}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition cursor-pointer"
            >
              Fill
            </button>
            <button
              type="button"
              onClick={handleEnterBossModeDirect}
              className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Enter Boss Mode</span>
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn(name, email, pin);
          }}
          className="my-4 space-y-3 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ali Haider or Hassan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. ah6304993@gmail.com or hassan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Founder PIN / Passkey (Optional)
              </span>
              <span className="text-[10px] text-amber-400 font-normal">PIN: 7860 for Boss</span>
            </label>
            <input
              type="password"
              placeholder="Enter PIN 7860 for instant Founder access"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-1 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Sign In to AI Agent Ali</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Identity Switcher Pills */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            1-Click Switchers (Test Dynamic Greetings):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('boss')}
              className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 hover:bg-amber-950/50 text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Ali Haider
              </div>
              <div className="text-[10px] text-amber-200/70 mt-0.5">Boss (Verified)</div>
            </button>

            <button
              onClick={() => handleQuickLogin('hassan')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Hassan
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">“Hassan ji” Greeting</div>
            </button>

            <button
              onClick={() => handleQuickLogin('zainab')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
                <User className="w-3.5 h-3.5 text-purple-400" />
                Zainab
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">“Zainab ji” Greeting</div>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs text-center font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            {statusMessage}
          </div>
        )}

        {/* Reconfigure Boss Key Link */}
        {onOpenFounderSetup && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFounderSetup();
              }}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <Key className="w-3 h-3" />
              <span>Configure / Reset Official Founder Credentials</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
