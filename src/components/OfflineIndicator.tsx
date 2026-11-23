import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 text-slate-950 px-3 py-2 text-xs font-bold shadow-xl backdrop-blur-md animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — Cached AI Agent Ali local intelligence active.</span>
    </div>
  );
};
