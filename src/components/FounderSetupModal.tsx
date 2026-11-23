import React, { useState } from 'react';
import {
  Crown,
  Key,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  Users,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  submitFounderAuthority,
  saveLocalFounderConfig,
  playExecutiveSpeech,
  unlockBrowserAudio,
} from '../services/api';

interface FounderSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupComplete: (founderProfile: UserProfile) => void;
  currentEmail?: string;
}

export const FounderSetupModal: React.FC<FounderSetupModalProps> = ({
  isOpen,
  onClose,
  onSetupComplete,
  currentEmail = 'ah6304993@gmail.com',
}) => {
  const [name, setName] = useState('Ali Haider');
  const [email, setEmail] = useState(currentEmail);
  const [pin, setPin] = useState('7860');
  const [language, setLanguage] = useState('Urdu');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Active Instant Action: Apply Preset Credentials
  const handleApplyPreset = () => {
    setName('Ali Haider');
    setEmail('ah6304993@gmail.com');
    setPin('7860');
    setLanguage('Urdu');
    setErrorMessage(null);
    setSuccessMessage('Preset credentials loaded: ah6304993@gmail.com (PIN: 7860)');
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  // Active Instant Action: Continue / Enter Boss Mode (Zero-Freeze Guarantee)
  const handleEnterBossMode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    unlockBrowserAudio();
    setErrorMessage(null);

    const cleanEmail = (email || 'ah6304993@gmail.com').trim().toLowerCase();
    const cleanPin = (pin || '7860').trim();
    const cleanName = (name || 'Boss (Ali Haider)').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please provide a valid official Founder Email address.');
      return;
    }

    if (cleanPin.length < 4) {
      setErrorMessage('Secret Boss PIN must be at least 4 digits (e.g. 7860).');
      return;
    }

    // 1. Immediately save synchronously to localStorage so no network lag freezes UI
    try {
      saveLocalFounderConfig({
        email: cleanEmail,
        pin: cleanPin,
        name: cleanName,
        isConfigured: true,
      });
    } catch (err) {
      console.warn('localStorage save warning:', err);
    }

    const founderProfile: UserProfile = {
      name: cleanName.toLowerCase().includes('boss') ? cleanName : `Boss (${cleanName})`,
      email: cleanEmail,
      role: 'founder',
      isFounder: true,
      language: language || 'Urdu',
      voicePersona: 'Kore',
      workingStyle: 'executive',
      plan: '$0 Lifetime Founder Plan',
      currency: 'USD',
      authPin: cleanPin,
    };

    // 2. Non-blocking background sync to server
    submitFounderAuthority({
      email: cleanEmail,
      pin: cleanPin,
      name: cleanName,
    }).catch((err) => console.warn('Background sync status:', err));

    // 3. Non-blocking audio playback
    try {
      playExecutiveSpeech(
        'Ji Boss, batayein main aap ke liye kya kaam kar sakta hoon?',
        'Kore',
        language || 'Urdu'
      );
    } catch (_) {}

    // 4. Instant UI transition
    onSetupComplete(founderProfile);
    onClose();
  };

  // Standard Guest Mode (Instant Entry for non-founder testing)
  const handleEnterStandardMode = () => {
    unlockBrowserAudio();
    const standardProfile: UserProfile = {
      name: 'Guest User',
      email: 'guest@workspace.com',
      role: 'standard',
      isFounder: false,
      language: language || 'Urdu',
      voicePersona: 'Zephyr',
      workingStyle: 'direct',
      plan: 'Standard Plan (Isolated)',
      currency: 'USD',
    };

    try {
      playExecutiveSpeech(
        'Khush amdeed! AI Agent Ali aap ke liye kya kaam kar sakta hai?',
        'Zephyr',
        language || 'Urdu'
      );
    } catch (_) {}

    onSetupComplete(standardProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
        {/* Top Gold Glowing Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Founder Authority Setup
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Boss Key
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Register your official Founder Email & 4-digit PIN for dynamic Boss authority.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg text-sm transition cursor-pointer"
            title="Dismiss Setup"
          >
            ✕
          </button>
        </div>

        {/* 1-Click Preset Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Preset: <strong>ah6304993@gmail.com</strong> (PIN: <strong>7860</strong>)
            </span>
          </div>
          <button
            type="button"
            onClick={handleApplyPreset}
            className="text-[11px] font-bold px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition shrink-0 flex items-center gap-1 shadow cursor-pointer active:scale-95"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Apply Preset</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleEnterBossMode} className="my-5 space-y-3.5 text-xs">
          {/* Founder Name */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Founder / Boss Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali Haider"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Official Email */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Official Founder / Boss Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ah6304993@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-mono transition"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Entering this registered email or PIN unlocks verified Boss status dynamically.
            </p>
          </div>

          {/* Secret 4-digit PIN */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Secret 4-Digit Boss PIN
              </span>
              <span className="text-[10px] text-amber-300 font-medium">
                Instant bypass & financial signing
              </span>
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="e.g. 7860"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-white focus:outline-none focus:border-amber-500 font-mono tracking-widest text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Preferred Executive Operating Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              <option value="Urdu">اردو (Urdu) — Natural Respectful Boss Cadence</option>
              <option value="English">English (Executive Directives)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Arabic">العربية (Arabic)</option>
            </select>
          </div>

          {/* Single Authority Notice */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Single Authority Rule:</strong> This email & PIN are stored as the dynamic Boss credential. Any other email operates strictly in standard user mode without access to system parameters.
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Primary Action: Continue / Enter Boss Mode */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => handleEnterBossMode()}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 text-xs tracking-wider uppercase cursor-pointer active:scale-[0.98]"
            >
              <Crown className="w-4 h-4 fill-current" />
              <span>Continue / Enter Boss Mode</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Secondary Action: Standard Guest User Mode */}
            <button
              type="button"
              onClick={handleEnterStandardMode}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Continue as Standard User (Guest Mode)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
