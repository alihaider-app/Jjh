export type UserRole = 'founder' | 'standard';

export interface UserProfile {
  email: string;
  name: string;
  role: UserRole;
  isFounder: boolean;
  language: string;
  voicePersona: 'Kore' | 'Zephyr' | 'Fenrir' | 'Puck';
  workingStyle: 'direct' | 'analytical' | 'executive' | 'autonomous';
  plan: string;
  currency: string;
  authPin?: string;
}

export interface FounderAuthorityConfig {
  email: string;
  pin: string;
  name: string;
  isConfigured: boolean;
  registeredAt?: number;
}

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'understanding'
  | 'planning'
  | 'working'
  | 'waiting_for_approval'
  | 'speaking'
  | 'completed';

export interface AgentStep {
  step: number;
  agent: string;
  action: string;
  status: 'pending' | 'in_progress' | 'completed' | 'waiting_for_approval' | 'error';
  log?: string;
}

export interface FinancialDetails {
  action: string;
  amount: string;
  currency: string;
  recipient: string;
  fundingSource: string;
  purpose: string;
  knownFees: string;
  importantRisks: string;
}

export interface BusinessArtifact {
  product: string;
  landedCost: number;
  sellingPrice: number;
  fbaFee: number;
  referralFee: number;
  netProfit: number;
  marginPct: number;
  breakevenUnits: number;
}

export interface ActionArtifact {
  type: 'business_analysis' | 'code_snippet' | 'tiktok_script' | 'dubbing_plan' | 'message_reply' | 'financial_gate' | 'text';
  title: string;
  data: any;
}

export interface ExecutiveResponse {
  success: boolean;
  isFounder: boolean;
  bossGreeting: string;
  replyText: string;
  speechText: string;
  specialistAgentsUsed: string[];
  taskCategory: 'business' | 'video_content' | 'video_dubbing' | 'coding' | 'email_message' | 'general' | 'financial';
  actionPlan: AgentStep[];
  requiresFinancialConfirmation: boolean;
  financialDetails?: FinancialDetails | null;
  artifact?: ActionArtifact | null;
}

export interface VideoDubbingChunk {
  id: number;
  timeRange: string;
  sourceText: string;
  translatedText: string;
  speaker: string;
  dubbedAudioStatus: string;
}

export interface VideoJob {
  id: string;
  title: string;
  duration: string;
  sourceLang: string;
  targetLang: string;
  mode: 'subtitles' | 'dubbing' | 'both';
  status: 'uploading' | 'analyzing' | 'chunking' | 'transcribing' | 'translating' | 'dubbing' | 'syncing' | 'rendering' | 'quality_check' | 'completed' | 'paused';
  progress: number;
  currentStep: string;
  chunks: VideoDubbingChunk[];
  subtitlesSrt: string;
  createdAt: number;
}

export interface ToolRegistryItem {
  id: string;
  name: string;
  category: 'Agent' | 'Tool' | 'Skill' | 'Connector';
  capabilities: string;
  riskLevel: 'Safe' | 'Consequential' | 'Financial' | 'Critical';
  isReversible: boolean;
  requiresConfirmation: boolean;
  connectionStatus: 'Connected' | 'Ready' | 'Configured';
  dataAccess: string;
}

export interface BossSystemSettings {
  temperature: number;
  customDirectives: string;
  unlockedAgents: string[];
  autoExecutionThreshold: 'conservative' | 'balanced' | 'autonomous';
  autonomousSpendLimit: number;
  loggingEnabled: boolean;
  lastUpdated: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  user: string;
  userEmail: string;
  prompt: string;
  category: string;
  speechText?: string;
  status: 'completed' | 'waiting_approval' | 'error';
  isFounder: boolean;
  specialistAgents: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ali';
  text: string;
  speechText?: string;
  timestamp: number;
  category?: string;
  actionPlan?: AgentStep[];
  isFounder?: boolean;
  requiresFinancialConfirmation?: boolean;
  financialDetails?: FinancialDetails | null;
  artifact?: ActionArtifact | null;
}

