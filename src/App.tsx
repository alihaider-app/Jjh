import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Cpu,
  Layers,
  TrendingUp,
  Video,
  Code2,
  Mail,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  Sliders,
  DollarSign,
  AlertTriangle,
  FileText,
  UserCheck,
  MessageSquare,
  Radio,
  Lock,
} from 'lucide-react';
import { UserProfile, VoiceState, ExecutiveResponse, FinancialDetails, ChatMessage } from './types';
import { sendExecutiveCommand, playExecutiveSpeech, stopExecutiveSpeech, unlockBrowserAudio, getLocalFounderConfig } from './services/api';
import { VoiceCore } from './components/VoiceCore';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { MultiAgentSteps } from './components/MultiAgentSteps';
import { BusinessDesk } from './components/BusinessDesk';
import { LongVideoDubbing } from './components/LongVideoDubbing';
import { TikTokStudio } from './components/TikTokStudio';
import { CodeStudio } from './components/CodeStudio';
import { MessageEmailDesk } from './components/MessageEmailDesk';
import { RegistryDesk } from './components/RegistryDesk';
import { FinancialSafetyModal } from './components/FinancialSafetyModal';
import { ExecutiveDocumentStudio } from './components/ExecutiveDocumentStudio';
import { AuthSignInModal } from './components/AuthSignInModal';
import { FounderSetupModal } from './components/FounderSetupModal';
import { BossAdminModal } from './components/BossAdminModal';
import { ChatInteractiveHub } from './components/ChatInteractiveHub';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Founder Authority Setup Prompt State (Active at startup if unconfigured or requested)
  const [founderSetupOpen, setFounderSetupOpen] = useState(false);

  // Boss Administrative Console Modal State
  const [bossAdminOpen, setBossAdminOpen] = useState(false);

  // Interaction Mode: Instant switching between 'voice' (Tactical Waveform) and 'chat' (Universal Stream)
  const [interactionMode, setInteractionMode] = useState<'voice' | 'chat'>('voice');

  // User Profile State (Default: Verified Founder Ali Haider / Boss)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const local = getLocalFounderConfig();
    if (local && local.isConfigured) {
      return {
        email: local.email,
        name: local.name.toLowerCase().includes('boss') ? local.name : `Boss (${local.name})`,
        role: 'founder',
        isFounder: true,
        language: 'Urdu',
        voicePersona: 'Kore',
        workingStyle: 'executive',
        plan: '$0 Lifetime Founder Plan',
        currency: 'USD',
        authPin: local.pin,
      };
    }
    return {
      email: 'ah6304993@gmail.com',
      name: 'Boss (Ali Haider)',
      role: 'founder',
      isFounder: true,
      language: 'Urdu',
      voicePersona: 'Kore',
      workingStyle: 'executive',
      plan: '$0 Lifetime Founder Plan',
      currency: 'USD',
      authPin: '7860',
    };
  });

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [activeTab, setActiveTab] = useState<
    'executive' | 'business' | 'video_dubbing' | 'tiktok' | 'coding' | 'message_email' | 'documents' | 'registry'
  >('executive');

  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTaskText, setActiveTaskText] = useState('');
  const [latestResponse, setLatestResponse] = useState<ExecutiveResponse | null>(null);

  // Conversation history for Universal Stream Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Financial safety modal state
  const [financialModalOpen, setFinancialModalOpen] = useState(false);
  const [financialDetails, setFinancialDetails] = useState<FinancialDetails | null>(null);

  // Auth / Sign-In modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Audio auto-play toggle
  const [voiceAutoPlayEnabled, setVoiceAutoPlayEnabled] = useState(true);

  // Check if Founder Authority was configured on app startup; if not, open setup prompt
  useEffect(() => {
    const local = getLocalFounderConfig();
    if (!local || !local.isConfigured) {
      setFounderSetupOpen(true);
    }
  }, []);

  // Dynamic welcome greeting on identity change
  useEffect(() => {
    const initialGreeting = userProfile.isFounder
      ? `Ji Boss, batayein aaj kya kaam karna hai? Main rupaaye, business, video translation ya coding sab manage karne ke liye tayyar hoon.`
      : `${userProfile.name} ji, kaise hain aap? Aaj AI Agent Ali aap ke liye kya kaam kar sakta hai?`;

    setActiveTaskText(initialGreeting);
  }, [userProfile.isFounder, userProfile.name]);

  // Executive command execution handler
  const handleExecuteCommand = async (commandText: string) => {
    if (!commandText.trim() || isProcessing) return;

    unlockBrowserAudio();
    stopExecutiveSpeech();
    setIsProcessing(true);
    setVoiceState('understanding');
    setActiveTaskText(commandText);

    // Append to Chat Message Stream
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: commandText,
      timestamp: Date.now(),
      isFounder: userProfile.isFounder,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setTimeout(() => {
        setVoiceState('planning');
      }, 300);

      const res = await sendExecutiveCommand(commandText, userProfile);
      setLatestResponse(res);

      // Append AI response to Chat Message Stream
      const aiMsg: ChatMessage = {
        id: `ali-${Date.now()}`,
        sender: 'ali',
        text: res.replyText,
        speechText: res.speechText,
        timestamp: Date.now(),
        category: res.taskCategory,
        actionPlan: res.actionPlan,
        isFounder: res.isFounder,
        requiresFinancialConfirmation: res.requiresFinancialConfirmation,
        financialDetails: res.financialDetails,
        artifact: res.artifact,
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (res.requiresFinancialConfirmation && res.financialDetails) {
        setVoiceState('waiting_for_approval');
        setFinancialDetails(res.financialDetails);
        setFinancialModalOpen(true);
      } else {
        setVoiceState('speaking');

        // Automatically route to tab if command clearly aligns
        if (res.taskCategory === 'business') {
          setActiveTab('business');
        } else if (res.taskCategory === 'video_dubbing') {
          setActiveTab('video_dubbing');
        } else if (res.taskCategory === 'video_content') {
          setActiveTab('tiktok');
        } else if (res.taskCategory === 'coding') {
          setActiveTab('coding');
        } else if (res.taskCategory === 'email_message') {
          setActiveTab('message_email');
        }

        // Trigger speech output reliably
        if (voiceAutoPlayEnabled && res.speechText) {
          await playExecutiveSpeech(
            res.speechText,
            userProfile.voicePersona,
            userProfile.language,
            () => {
              setVoiceState('completed');
            }
          );
        } else {
          setVoiceState('completed');
        }
      }
    } catch (err: any) {
      console.error('Command Execution Error:', err);
      setVoiceState('idle');
    } finally {
      setIsProcessing(false);
      setTextInput('');
    }
  };

  const handleLoginSuccess = (profile: UserProfile, greetingMessage: string) => {
    setUserProfile(profile);
    setActiveTaskText(greetingMessage);
    setLatestResponse(null);
    setVoiceState('speaking');
    setTimeout(() => {
      setVoiceState('idle');
    }, 3500);
  };

  // Lock Boss Mode and revert to safe Standard Guest Tenant
  const handleLockBossMode = () => {
    setUserProfile({
      email: 'guest@workspace.com',
      name: 'Guest User',
      role: 'standard',
      isFounder: false,
      language: userProfile.language || 'Urdu',
      voicePersona: 'Zephyr',
      workingStyle: 'direct',
      plan: 'Standard Tier (Isolated)',
      currency: 'USD',
    });
    setLatestResponse(null);
    setActiveTaskText('Boss Mode Locked. AI Agent Ali is running in General User Mode.');
    playExecutiveSpeech(
      'Boss Mode lock kar diya gaya hai. Ab AI Agent Ali standard guest session mein hai.',
      'Zephyr',
      userProfile.language
    );
  };

  const handleSwitchTenant = (role: 'founder' | 'standard') => {
    if (role === 'founder') {
      const local = getLocalFounderConfig();
      const founderEmail = local?.email || 'ah6304993@gmail.com';
      const founderPin = local?.pin || '7860';
      const founderName = local?.name ? `Boss (${local.name})` : 'Boss (Ali Haider)';

      setUserProfile({
        email: founderEmail,
        name: founderName,
        role: 'founder',
        isFounder: true,
        language: 'Urdu',
        voicePersona: 'Kore',
        workingStyle: 'executive',
        plan: '$0 Lifetime Founder Plan',
        currency: 'USD',
        authPin: founderPin,
      });
      setVoiceState('speaking');
      playExecutiveSpeech(
        'Ji Boss, batayein main aap ke liye kya kaam kar sakta hoon?',
        'Kore',
        'Urdu',
        () => setVoiceState('idle')
      );
    } else {
      setUserProfile({
        email: 'hassan@example.com',
        name: 'Hassan',
        role: 'standard',
        isFounder: false,
        language: 'Urdu',
        voicePersona: 'Zephyr',
        workingStyle: 'direct',
        plan: 'Standard Plan (Isolated)',
        currency: 'USD',
      });
      setVoiceState('speaking');
      playExecutiveSpeech(
        'Hassan ji, kaise hain aap? Aaj AI Agent Ali aap ke liye kya kaam kar sakta hai?',
        'Zephyr',
        'Urdu',
        () => setVoiceState('idle')
      );
    }
  };

  const handleMessageToVideo = (messageContent: string) => {
    setActiveTab('tiktok');
    handleExecuteCommand(
      `Is message ko dekho aur is topic par viral TikTok video script ready karo: "${messageContent.slice(0, 150)}..."`
    );
  };

  const navigationTabs = [
    { id: 'executive', label: 'Command Hub', icon: Sparkles },
    { id: 'business', label: 'Alibaba ➔ Amazon', icon: TrendingUp },
    { id: 'video_dubbing', label: 'Long Video Dubbing', icon: Video },
    { id: 'tiktok', label: 'TikTok & Hooks', icon: Video },
    { id: 'coding', label: 'App & Coding', icon: Code2 },
    { id: 'message_email', label: 'Messages & Email', icon: Mail },
    { id: 'documents', label: 'Executive Documents', icon: FileText },
    { id: 'registry', label: 'Workforce Registry', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header Navigation */}
      <ExecutiveHeader
        userProfile={userProfile}
        onChangeProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
        onSwitchTenant={handleSwitchTenant}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenFounderSetup={() => setFounderSetupOpen(true)}
        onOpenBossAdmin={() => setBossAdminOpen(true)}
        onLockBossMode={handleLockBossMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Workspace Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Voice Auto-Play Toggle */}
          <button
            onClick={() => {
              setVoiceAutoPlayEnabled(!voiceAutoPlayEnabled);
              if (voiceAutoPlayEnabled) stopExecutiveSpeech();
            }}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              voiceAutoPlayEnabled
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle automatic AI voice response after prompts"
          >
            {voiceAutoPlayEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice Response: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Voice Response: MUTED</span>
              </>
            )}
          </button>
        </div>

        {/* Tab 1: Live Voice & Executive Command Center */}
        {activeTab === 'executive' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Mode Switcher: Voice / Audio Tactical Core vs Universal Stream Chat */}
            <div className="flex items-center justify-between bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setInteractionMode('voice')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    interactionMode === 'voice'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>🎙️ Tactical Voice Core</span>
                </button>

                <button
                  onClick={() => setInteractionMode('chat')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    interactionMode === 'chat'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>💬 Universal Stream Chat ({messages.length})</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline px-2">
                {interactionMode === 'voice'
                  ? 'Hands-free voice recognition & live audio waveform'
                  : 'Universal multi-turn knowledge, code & document stream'}
              </span>
            </div>

            {/* View A: Voice Tactical Core */}
            {interactionMode === 'voice' && (
              <div className="space-y-6 animate-fadeIn">
                <VoiceCore
                  voiceState={voiceState}
                  onSendCommand={handleExecuteCommand}
                  activeTaskText={activeTaskText}
                  userProfile={userProfile}
                  isProcessing={isProcessing}
                />

                {/* Dynamic Multi-Agent Planning & Execution Feed */}
                {latestResponse && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Multi-Agent Step Pipeline (5 cols) */}
                    <div className="lg:col-span-5">
                      <MultiAgentSteps
                        steps={latestResponse.actionPlan}
                        specialistAgents={latestResponse.specialistAgentsUsed}
                      />
                    </div>

                    {/* Right: Executive Report & Deliverable (7 cols) */}
                    <div className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            Executive Manager Briefing
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          {latestResponse.speechText && (
                            <button
                              onClick={() =>
                                playExecutiveSpeech(
                                  latestResponse.speechText,
                                  userProfile.voicePersona,
                                  userProfile.language
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                              title="Replay Ali's vocal speech"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Replay Voice</span>
                            </button>
                          )}

                          {latestResponse.isFounder ? (
                            <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                              Boss Session
                            </span>
                          ) : (
                            <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                              {userProfile.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Greeting Quote */}
                      {latestResponse.bossGreeting && (
                        <div className="text-sm font-bold text-cyan-300 italic mb-3">
                          “{latestResponse.bossGreeting}”
                        </div>
                      )}

                      {/* Parsed Executive Markdown Output */}
                      <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-[420px] overflow-y-auto pr-2">
                        {latestResponse.replyText.split('\n\n').map((paragraph, idx) => {
                          if (paragraph.startsWith('### ')) {
                            return (
                              <h4 key={idx} className="text-sm font-extrabold text-white mt-2 mb-1">
                                {paragraph.replace('### ', '')}
                              </h4>
                            );
                          }
                          if (paragraph.startsWith('#### ')) {
                            return (
                              <h5 key={idx} className="text-xs font-bold text-cyan-300 mt-2">
                                {paragraph.replace('#### ', '')}
                              </h5>
                            );
                          }
                          return (
                            <p key={idx} className="text-slate-300">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View B: Universal Stream Chat Hub */}
            {interactionMode === 'chat' && (
              <ChatInteractiveHub
                messages={messages}
                onSendMessage={handleExecuteCommand}
                isProcessing={isProcessing}
                userProfile={userProfile}
                voiceAutoPlay={voiceAutoPlayEnabled}
                onToggleVoiceAutoPlay={() => {
                  setVoiceAutoPlayEnabled(!voiceAutoPlayEnabled);
                  if (voiceAutoPlayEnabled) stopExecutiveSpeech();
                }}
              />
            )}
          </div>
        )}

        {/* Tab 2: Business & Alibaba -> Amazon Desk */}
        {activeTab === 'business' && (
          <div className="animate-fadeIn">
            <BusinessDesk />
          </div>
        )}

        {/* Tab 3: Long Video Translation & Dubbing Pipeline */}
        {activeTab === 'video_dubbing' && (
          <div className="animate-fadeIn">
            <LongVideoDubbing />
          </div>
        )}

        {/* Tab 4: TikTok & Short-form Content Studio */}
        {activeTab === 'tiktok' && (
          <div className="animate-fadeIn">
            <TikTokStudio />
          </div>
        )}

        {/* Tab 5: App & Code Studio */}
        {activeTab === 'coding' && (
          <div className="animate-fadeIn">
            <CodeStudio />
          </div>
        )}

        {/* Tab 6: Message & Email Desk */}
        {activeTab === 'message_email' && (
          <div className="animate-fadeIn">
            <MessageEmailDesk onTriggerVideoWorkflow={handleMessageToVideo} />
          </div>
        )}

        {/* Tab 7: Executive Documents Studio */}
        {activeTab === 'documents' && (
          <div className="animate-fadeIn">
            <ExecutiveDocumentStudio />
          </div>
        )}

        {/* Tab 8: Specialist Workforce & Tool Registry */}
        {activeTab === 'registry' && (
          <div className="animate-fadeIn">
            <RegistryDesk />
          </div>
        )}

        {/* Bottom Fallback Text Command Bar */}
        <div className="mt-auto pt-4 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteCommand(textInput);
            }}
            className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-xl backdrop-blur-md"
          >
            <input
              type="text"
              placeholder={
                userProfile.isFounder
                  ? 'Boss, yahan likhein ya microphone ka istemal karein (e.g. Alibaba sourcing, video dubbing, app code, science)...'
                  : `${userProfile.name} ji, yahan apna sawal likhein ya microphone se batayein...`
              }
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />

            <button
              type="submit"
              onPointerDown={() => unlockBrowserAudio()}
              onClick={() => unlockBrowserAudio()}
              disabled={isProcessing || !textInput.trim()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <span>Dispatch</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </main>

      {/* Financial / Purchase Safety Modal */}
      <FinancialSafetyModal
        isOpen={financialModalOpen}
        details={financialDetails}
        userProfile={userProfile}
        onClose={() => setFinancialModalOpen(false)}
        onAuthorized={() => {
          setVoiceState('completed');
          setActiveTaskText('Financial payment authorized by verified Boss. Audit log sealed.');
        }}
      />

      {/* Auth / Sign-In Modal */}
      <AuthSignInModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLoginSuccess}
        currentProfile={userProfile}
        onOpenFounderSetup={() => setFounderSetupOpen(true)}
      />

      {/* Founder Authority Setup Modal */}
      <FounderSetupModal
        isOpen={founderSetupOpen}
        onClose={() => setFounderSetupOpen(false)}
        onSetupComplete={(founderProfile) => {
          setUserProfile(founderProfile);
          setActiveTaskText('Ji Boss, Founder credentials confirmed and active.');
        }}
        currentEmail={userProfile.email}
      />

      {/* Boss Executive Administrative Console Modal */}
      <BossAdminModal
        isOpen={bossAdminOpen}
        onClose={() => setBossAdminOpen(false)}
        userProfile={userProfile}
        onLockBossMode={handleLockBossMode}
      />

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
