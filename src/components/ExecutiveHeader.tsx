import React, { useState } from 'react';
import {
  ShieldCheck,
  Crown,
  Users,
  Settings,
  Globe,
  Sliders,
  DollarSign,
  Lock,
  LogOut,
  Sparkles,
  ChevronDown,
  UserCheck,
  Key,
  Download,
} from 'lucide-react';
import { UserProfile } from '../types';
import { playExecutiveSpeech } from '../services/api';
import { PWAInstallButton } from './PWAInstallButton';

interface ExecutiveHeaderProps {
  userProfile: UserProfile;
  onChangeProfile: (updated: Partial<UserProfile>) => void;
  onSwitchTenant: (role: 'founder' | 'standard') => void;
  onOpenAuthModal: () => void;
  onOpenFounderSetup?: () => void;
  onOpenBossAdmin?: () => void;
  onLockBossMode?: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  userProfile,
  onChangeProfile,
  onSwitchTenant,
  onOpenAuthModal,
  onOpenFounderSetup,
  onOpenBossAdmin,
  onLockBossMode,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);

  const languages = [
    { code: 'Urdu', label: 'اردو (Urdu)' },
    { code: 'English', label: 'English (US)' },
    { code: 'Hindi', label: 'हिंदी (Hindi)' },
    { code: 'Arabic', label: 'العربية (Arabic)' },
    { code: 'Persian', label: 'فارسی (Persian)' },
    { code: 'Punjabi', label: 'پنجابی (Punjabi)' },
    { code: 'Chinese', label: '中文 (Chinese)' },
    { code: 'Spanish', label: 'Español (Spanish)' },
    { code: 'German', label: 'Deutsch (German)' },
    { code: 'French', label: 'Français (French)' },
    { code: 'Turkish', label: 'Türkçe (Turkish)' },
  ];

  const voices = [
    { id: 'Kore', label: 'Kore (Executive Female — Natural & Poised)' },
    { id: 'Zephyr', label: 'Zephyr (Executive Male — Clear & Articulate)' },
    { id: 'Fenrir', label: 'Fenrir (Deep Authoritative Male)' },
    { id: 'Puck', label: 'Puck (High-Energy Dynamic)' },
  ];

  const handleDownloadStandalone = () => {
    const a = document.createElement('a');
    a.href = '/download/index.html';
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <span className="text-white font-black text-lg tracking-wider">ALI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-wide">
                  AI AGENT ALI
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                  EXECUTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Voice-First Multi-Agent Workforce & Action System
              </p>
            </div>
          </div>

          {/* Center: Persistent Founder Access Toggle / Lock Status Bar */}
          <div className="flex items-center gap-2">
            {userProfile.isFounder ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenBossAdmin || onOpenAuthModal}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 border border-amber-500/60 text-amber-300 shadow-md shadow-amber-500/10 hover:border-amber-400 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                  title="Click to open Boss Executive Console (Parameters, Directives, Logs)"
                >
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                  <span className="text-xs font-black tracking-wide">
                    {userProfile.name.toUpperCase()}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-200 font-extrabold border border-amber-400/40">
                    Boss Console
                  </span>
                </button>

                {onLockBossMode && (
                  <button
                    onClick={onLockBossMode}
                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800/80 transition cursor-pointer"
                    title="Lock Boss Mode (Log Out to General User)"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer group"
                  title="Enter Founder PIN/Email to Unlock Boss Mode"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold tracking-wide">
                    Founder Access (Locked)
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 font-mono">
                    Enter PIN
                  </span>
                </button>

                <button
                  onClick={onOpenAuthModal}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
                  title="Switch user"
                >
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span className="truncate max-w-[100px]">{userProfile.name}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* In-App PWA Install Button (Home Screen support) */}
            <PWAInstallButton />

            {/* Download Standalone Single-File index.html */}
            <button
              onClick={handleDownloadStandalone}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Download self-contained index.html with all React code, CSS & features"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Download HTML</span>
            </button>

            {/* Language Quick Dropdown */}
            <div className="relative hidden lg:block">
              <select
                aria-label="Language"
                value={userProfile.language}
                onChange={(e) => onChangeProfile({ language: e.target.value })}
                className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Founder Authority Key Button */}
            {onOpenFounderSetup && (
              <button
                onClick={onOpenFounderSetup}
                className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                title="Founder / Boss Authority Setup"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Boss Key</span>
              </button>
            )}

            {/* Tenant Isolation Switcher */}
            <button
              onClick={() => setShowTenantModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
              title="Test multi-tenant isolation (Founder vs Standard User)"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Workspace</span>
            </button>

            {/* Preferences Modal Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition cursor-pointer"
              title="Executive Settings & Voice Persona"
            >
              <Settings className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Tenant / Account Isolation Switcher Modal */}
      {showTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Tenant Isolation & Identity
                </h3>
              </div>
              <button
                onClick={() => setShowTenantModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-3 mb-4">
              AI Agent Ali enforces strict user/tenant data isolation. Normal users never have access to Founder business accounts, files, or memory.
            </p>

            <div className="space-y-3">
              {/* Option 1: Authenticated Founder (Boss) */}
              <div
                onClick={() => {
                  onSwitchTenant('founder');
                  setShowTenantModal(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  userProfile.isFounder
                    ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Boss / Founder Account
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    $0 Lifetime
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">ah6304993@gmail.com</p>
                <p className="text-[11px] text-amber-200/70 mt-1">
                  • Greeted as “Boss” (“Ji Boss, batayein main aap ke liye kya kaam kar sakta hoon?”)
                  <br />• All application features unlocked permanently at $0.
                </p>
              </div>

              {/* Option 2: Public Standard User */}
              <div
                onClick={() => {
                  onSwitchTenant('standard');
                  setShowTenantModal(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  !userProfile.isFounder
                    ? 'bg-cyan-950/20 border-cyan-500/60 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Public Guest Tenant
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Isolated
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">guest_user_921@domain.com</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  • Standard assistant tone (No Founder privileges).
                  <br />• Zero access to Founder marketplace credentials or financial authorization.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings & Preferences Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Executive Voice & System Settings
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {/* Language Selection */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Preferred Communication Language
                </label>
                <select
                  value={userProfile.language}
                  onChange={(e) => onChangeProfile({ language: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ali auto-detects input language and replies in your chosen dialect.
                </p>
              </div>

              {/* Voice Persona */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-300">
                    AI Voice Persona (Gemini 3.8 Flash Lite Audio)
                  </label>
                  <button
                    onClick={() => {
                      const sampleText = userProfile.language.toLowerCase().includes('urdu')
                        ? 'Ji Boss, main aap ki aawaz aur ehkaam sunne ke liye tayyar hoon.'
                        : 'Boss, AI Agent Ali is ready to execute your executive directives.';
                      playExecutiveSpeech(sampleText, userProfile.voicePersona, userProfile.language);
                    }}
                    className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Audition Voice 🔊
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => onChangeProfile({ voicePersona: v.id as any })}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        userProfile.voicePersona === v.id
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{v.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{v.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Working Style */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Founder Working Style
                </label>
                <select
                  value={userProfile.workingStyle}
                  onChange={(e) => onChangeProfile({ workingStyle: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="executive">Executive Briefing (Decisive, concise, high impact)</option>
                  <option value="direct">Direct & Swift (Straight to results, minimal pleasantry)</option>
                  <option value="analytical">Deep Analytical (Thorough unit economics & risks)</option>
                  <option value="autonomous">High Autonomy (Proactive agent delegation)</option>
                </select>
              </div>

              {/* Founder Free Access Statement */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <div className="font-bold text-xs flex items-center gap-1.5 text-amber-300 mb-0.5">
                  <DollarSign className="w-4 h-4" />
                  Founder Subscription Policy
                </div>
                <p className="text-[11px] leading-relaxed">
                  AI Agent Ali's own subscription is permanently $0 for the verified Founder. No internal credit packages or paywalls are ever shown.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition shadow"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
