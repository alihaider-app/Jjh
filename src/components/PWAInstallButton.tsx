import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition cursor-pointer active:scale-95"
        title="Install AI Agent Ali on your phone or computer"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install PWA</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-800/80 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-950/70 transition cursor-pointer active:scale-95"
          title="Install on iOS Safari"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Add to Home</span>
          <span className="sm:hidden">Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                  ALI
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Install on iPhone / iPad</h3>
                  <p className="text-[11px] text-slate-400">Add AI Agent Ali to your Home Screen</p>
                </div>
              </div>

              <div className="space-y-3 my-4 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    1
                  </div>
                  <div>
                    Tap the <strong className="text-white flex-inline items-center gap-1"><Share className="w-3.5 h-3.5 inline mx-0.5 text-cyan-400" /> Share</strong> button in Safari's bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    2
                  </div>
                  <div>
                    Scroll down and tap <strong className="text-white"><PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-cyan-400" /> Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    3
                  </div>
                  <div>
                    Tap <strong>Add</strong> in top right. AI Agent Ali will launch full-screen!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 py-2.5 text-xs font-bold text-white hover:from-cyan-500 hover:to-indigo-500 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback install button for unsupported browsers / iframe testing
  return (
    <button
      onClick={() => {
        alert('To install AI Agent Ali as an app, tap your browser menu (⋮ or Share) and select "Add to Home Screen" or "Install App".');
      }}
      className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
      title="Install instructions"
    >
      <Download className="w-3.5 h-3.5 text-cyan-400" />
      <span>Install PWA</span>
    </button>
  );
};
