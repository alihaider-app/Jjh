import React from 'react';
import { AgentStep } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  Cpu,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface MultiAgentStepsProps {
  steps: AgentStep[];
  specialistAgents: string[];
}

export const MultiAgentSteps: React.FC<MultiAgentStepsProps> = ({
  steps,
  specialistAgents,
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Multi-Agent Autonomous Execution Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {specialistAgents.map((agent, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold"
            >
              {agent}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';
          const isWaiting = step.status === 'waiting_for_approval';
          const isError = step.status === 'error';

          return (
            <div
              key={step.step}
              className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                isDone
                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                  : isInProgress
                  ? 'bg-cyan-950/20 border-cyan-500/50 text-white shadow-lg shadow-cyan-950/40'
                  : isWaiting
                  ? 'bg-rose-950/20 border-rose-500/50 text-rose-200'
                  : 'bg-slate-950/40 border-slate-800/50 text-slate-500'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                ) : isInProgress ? (
                  <PlayCircle className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : isWaiting ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white tracking-wide">
                    {step.agent}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded font-bold ${
                      isDone
                        ? 'bg-teal-500/20 text-teal-300'
                        : isInProgress
                        ? 'bg-cyan-500/20 text-cyan-300 animate-pulse'
                        : isWaiting
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {step.action}
                </p>
                {step.log && (
                  <div className="mt-1.5 text-[11px] font-mono text-cyan-300/80 bg-slate-950/80 p-1.5 rounded border border-slate-800">
                    {step.log}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
