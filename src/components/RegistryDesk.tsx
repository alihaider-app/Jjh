import React, { useState } from 'react';
import {
  Layers,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  Cpu,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { SPECIALIST_REGISTRY } from '../data/registryData';
import { ToolRegistryItem } from '../types';

export const RegistryDesk: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = SPECIALIST_REGISTRY.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.capabilities.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || item.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getRiskBadge = (risk: ToolRegistryItem['riskLevel']) => {
    switch (risk) {
      case 'Safe':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Consequential':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Financial':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Critical':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              EXPANDABLE INFRASTRUCTURE
            </span>
            <span className="text-xs text-slate-400">• Agent & Tool Registry</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Specialist Workforce & Connected Capabilities ({SPECIALIST_REGISTRY.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Each internal specialist and tool describes its permissions, reversibility, risk classification, and confirmation gates.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agents or tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'Agent', 'Tool', 'Skill', 'Connector'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold capitalize transition ${
              filterCategory === cat
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Registered Specialists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-5 backdrop-blur-md flex flex-col justify-between transition-all duration-200"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white tracking-wide">{item.name}</h4>
                </div>
                <span
                  className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(
                    item.riskLevel
                  )}`}
                >
                  {item.riskLevel}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                {item.capabilities}
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Data Access:</span>
                <span className="text-slate-300 truncate max-w-[150px]">{item.dataAccess}</span>
              </div>
              <div className="flex justify-between">
                <span>Reversible:</span>
                <span className={item.isReversible ? 'text-teal-400' : 'text-rose-400'}>
                  {item.isReversible ? 'Yes (Safe Rollback)' : 'No (Permanent)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Boss Confirmation:</span>
                <span className={item.requiresConfirmation ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                  {item.requiresConfirmation ? 'Required' : 'Autonomous'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
