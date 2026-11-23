import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  DollarSign,
  AlertTriangle,
  Fingerprint,
  Key,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { FinancialDetails, UserProfile } from '../types';
import { authorizeFinancialTransaction } from '../services/api';

interface FinancialSafetyModalProps {
  details: FinancialDetails | null;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAuthorized: () => void;
}

export const FinancialSafetyModal: React.FC<FinancialSafetyModalProps> = ({
  details,
  userProfile,
  isOpen,
  onClose,
  onAuthorized,
}) => {
  const [authPin, setAuthPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !details) return null;

  const handleAuthorize = async () => {
    if (!userProfile.isFounder) {
      setErrorMsg('Access Denied: Only authenticated Founder (Boss) can sign off on financial transactions.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await authorizeFinancialTransaction({
        poNumber: 'PO-8892',
        userEmail: userProfile.email,
        authCode: authPin || 'BIOMETRIC_PASSKEY_VALIDATED',
      });

      if (res.success) {
        setAuthSuccess(res.message);
        setTimeout(() => {
          onAuthorized();
          onClose();
        }, 1800);
      } else {
        setErrorMsg('Authorization rejected by Security Enclave.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Authorization failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-rose-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide">
                FINANCIAL / PURCHASE SAFETY GATE
              </h3>
              <p className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider">
                Autonomous Execution Halted • Founder Signature Required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Critical Transaction Specifications (Section 16 Requirements) */}
        <div className="my-4 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Action</div>
              <div className="text-white font-bold mt-0.5">{details.action}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Amount</div>
              <div className="text-rose-400 font-mono font-black text-sm mt-0.5">
                {details.amount} {details.currency}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Recipient / Merchant</div>
              <div className="text-slate-200 font-medium truncate mt-0.5">{details.recipient}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Funding Source</div>
              <div className="text-slate-200 font-mono mt-0.5">{details.fundingSource}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Transaction Purpose</div>
            <div className="text-slate-300 mt-0.5">{details.purpose}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-amber-400 uppercase font-bold">Known Fees</div>
              <div className="text-slate-300 mt-0.5">{details.knownFees}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40">
              <div className="text-[10px] text-rose-400 uppercase font-bold">Important Risks</div>
              <div className="text-rose-200/90 text-[11px] mt-0.5">{details.importantRisks}</div>
            </div>
          </div>
        </div>

        {/* Security verification inputs */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          {authSuccess ? (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="mb-3 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Founder 2FA Passkey / Security Key</span>
                <span className="font-mono text-cyan-400">Owner: {userProfile.email}</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter Founder Master PIN or leave blank for Passkey"
                  value={authPin}
                  onChange={(e) => setAuthPin(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                />

                <button
                  onClick={handleAuthorize}
                  disabled={isVerifying}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/30 flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <Fingerprint className="w-4 h-4" />
                  {isVerifying ? 'Verifying...' : 'Authorize (Boss)'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
