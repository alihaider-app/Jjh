import React, { useState, useEffect } from 'react';
import {
  Crown,
  Settings,
  Sliders,
  ShieldAlert,
  Download,
  Trash2,
  Lock,
  CheckCircle2,
  Sparkles,
  Cpu,
  Layers,
  FileText,
  AlertCircle,
  RefreshCw,
  LogOut,
  Save,
} from 'lucide-react';
import { UserProfile, BossSystemSettings, AuditLogEntry } from '../types';
import { fetchBossSettings, saveBossSettings, fetchAuditLogs, clearAuditLogs, playExecutiveSpeech } from '../services/api';

interface BossAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLockBossMode: () => void;
}

export const BossAdminModal: React.FC<BossAdminModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLockBossMode,
}) => {
  const [activeTab, setActiveTab] = useState<'parameters' | 'directives' | 'agents' | 'logs'>('parameters');
  const [settings, setSettings] = useState<BossSystemSettings>({
    temperature: 0.7,
    customDirectives: 'Direct, high-impact reasoning with respectful cadence. Deliver concrete steps.',
    unlockedAgents: [
      'Universal Knowledge Agent',
      'Deep Research & Market Scraper',
      'Full-Stack Architect Agent',
      'Autonomous Supplier Negotiator',
      'Video Dubbing & Subtitle Engine',
      'Executive Financial Escrow Gate',
    ],
    autoExecutionThreshold: 'balanced',
    autonomousSpendLimit: 500,
    loggingEnabled: true,
    lastUpdated: Date.now(),
  });

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const availableSpecialistAgents = [
    { id: 'Universal Knowledge Agent', name: 'Universal Knowledge & Multi-Step Brain', desc: 'Unrestricted reasoning across science, history, coding & human questions', tier: 'Tier 1' },
    { id: 'Deep Research & Market Scraper', name: 'Deep Market & Supplier Scraper', desc: 'Live Alibaba, Amazon and global commercial intelligence', tier: 'Tier 1' },
    { id: 'Full-Stack Architect Agent', name: 'Full-Stack Architecture & Code Agent', desc: 'Designs production-grade apps, database schemas & APIs', tier: 'Tier 1' },
    { id: 'Autonomous Supplier Negotiator', name: 'Autonomous Supplier Negotiator', desc: 'Drafts and analyzes RFQs, MOQs, sample rates & DDP freight', tier: 'Tier 2' },
    { id: 'Video Dubbing & Subtitle Engine', name: 'Long Video Dubbing & Subtitle Engine', desc: 'Multi-lingual timestamp translation for 1h-3h video files', tier: 'Tier 2' },
    { id: 'Executive Financial Escrow Gate', name: 'Executive Financial Escrow Safety Gate', desc: 'Enforces explicit Boss authorization before moving any capital', tier: 'Security' },
  ];

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      loadLogs();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    const data = await fetchBossSettings();
    if (data) setSettings(data);
  };

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    const data = await fetchAuditLogs(userProfile.email);
    setLogs(data);
    setIsLoadingLogs(false);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await saveBossSettings({
        userEmail: userProfile.email,
        authPin: userProfile.authPin || '7860',
        settings,
      });
      if (res.success) {
        setStatusMessage('Boss Administrative Parameters saved successfully!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (e: any) {
      setStatusMessage('Error saving parameters: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to purge all audit execution logs?')) return;
    await clearAuditLogs({
      userEmail: userProfile.email,
      authPin: userProfile.authPin || '7860',
    });
    setLogs([]);
    setStatusMessage('Audit logs purged.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ali-agent-audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAgent = (agentId: string) => {
    setSettings((prev) => {
      const exists = prev.unlockedAgents.includes(agentId);
      const nextAgents = exists
        ? prev.unlockedAgents.filter((a) => a !== agentId)
        : [...prev.unlockedAgents, agentId];
      return { ...prev, unlockedAgents: nextAgents };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Gold Glowing Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  BOSS EXECUTIVE CONSOLE
                </h2>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  VERIFIED FOUNDER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                System parameters, custom AI directives, specialist agents & audit export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg text-sm transition"
              title="Close Console"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 py-3 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('parameters')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              activeTab === 'parameters'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Parameters</span>
          </button>

          <button
            onClick={() => setActiveTab('directives')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              activeTab === 'directives'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>System Directives</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              activeTab === 'agents'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Specialist Agents</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              activeTab === 'logs'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Audit Logs ({logs.length})</span>
          </button>
        </div>

        {/* Tab 1: Parameters */}
        <div className="flex-1 overflow-y-auto py-4 text-xs space-y-4">
          {activeTab === 'parameters' && (
            <div className="space-y-4">
              {/* Creativity / Temperature */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Model Reasoning Creativity (Temperature: {settings.temperature})
                  </label>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {settings.temperature < 0.4 ? 'Strict & Analytical' : settings.temperature < 0.8 ? 'Balanced Executive' : 'Highly Creative & Lateral'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0.2 (Rigid Math & Escrow)</span>
                  <span>0.7 (Default Executive)</span>
                  <span>1.0 (Brainstorming)</span>
                </div>
              </div>

              {/* Autonomy Level */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <label className="font-bold text-slate-200 block mb-2">
                  Autonomous Agent Execution Threshold
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'conservative', label: 'Conservative', desc: 'Ask Boss before non-trivial multi-agent work' },
                    { id: 'balanced', label: 'Balanced (Standard)', desc: 'Auto-execute safe research, ask on money' },
                    { id: 'autonomous', label: 'Full Autonomous', desc: 'Complete end-to-end deliverables proactively' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, autoExecutionThreshold: lvl.id as any })}
                      className={`p-3 rounded-xl border text-left transition ${
                        settings.autoExecutionThreshold === lvl.id
                          ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{lvl.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Safety Limit */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    Zero-Silent-Spend Policy & Hard Escrow Limit ($)
                  </label>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">
                    ${settings.autonomousSpendLimit} Max Cap
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="50"
                  value={settings.autonomousSpendLimit}
                  onChange={(e) => setSettings({ ...settings, autonomousSpendLimit: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Any PO or supplier transaction above $0 requires dual verification by the Boss.
                </p>
              </div>

              {/* Standalone Single-File index.html Export */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download Standalone Single-File (index.html)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Self-contained offline file with complete React code, CSS styles, Voice Engine, and 28+ agents.
                  </p>
                </div>
                <a
                  href="/download/index.html"
                  download="index.html"
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          )}

          {/* Tab 2: Custom System Directives */}
          {activeTab === 'directives' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-200">
                  Boss Custom Directives for AI Agent Ali
                </label>
                <span className="text-[10px] text-slate-400">
                  Injected into every Executive LLM session
                </span>
              </div>
              <textarea
                rows={8}
                value={settings.customDirectives}
                onChange={(e) => setSettings({ ...settings, customDirectives: e.target.value })}
                placeholder="Enter custom instructions for how Ali should address you, analyze deals, write code, or negotiate with suppliers..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-500"
              />
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                <Crown className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Boss Sovereign Control:</strong> These custom instructions dynamically guide Ali's tone, unit economics formula, and speech script phrasing.
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Specialist Agents Workforce */}
          {activeTab === 'agents' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Configure which high-tier specialist agents are authorized to operate autonomously under Ali's command:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {availableSpecialistAgents.map((agent) => {
                  const isUnlocked = settings.unlockedAgents.includes(agent.id);
                  return (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgent(agent.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-amber-950/20 border-amber-500/40 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 font-bold text-xs text-white">
                          <span>{agent.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            {agent.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{agent.desc}</p>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isUnlocked
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isUnlocked ? 'ACTIVE' : 'LOCKED'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Audit Logs & Export */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">Execution & Dispatch History</span>
                  <button
                    onClick={loadLogs}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                    title="Refresh logs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportLogs}
                    disabled={logs.length === 0}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={handleClearLogs}
                    disabled={logs.length === 0}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 hover:bg-rose-900/60 text-[11px] font-bold flex items-center gap-1 transition disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge</span>
                  </button>
                </div>
              </div>

              {isLoadingLogs ? (
                <div className="p-8 text-center text-slate-400">Loading audit log entries...</div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                  No execution logs recorded yet. Commands will be tracked here.
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-cyan-300 flex items-center gap-1">
                          {log.isFounder ? '👑 Boss' : `👤 ${log.user}`}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium truncate">"{log.prompt}"</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {log.category}
                        </span>
                        <span className="text-slate-500">
                          Agents: {log.specialistAgents.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feedback message */}
        {statusMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
          {/* Lock / Log Out Button */}
          <button
            type="button"
            onClick={() => {
              onLockBossMode();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 font-bold flex items-center gap-2 transition cursor-pointer"
            title="Lock Boss Mode and switch back to Standard Tenant"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock / Log Out Boss Mode</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Parameters'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
