import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Building,
  FileCheck,
  Layers,
} from 'lucide-react';

export const ExecutiveDocumentStudio: React.FC = () => {
  const [selectedDocType, setSelectedDocType] = useState<
    'supplier_contract' | 'feasibility_report' | 'dubbing_cuesheet' | 'app_spec'
  >('supplier_contract');

  const [copied, setCopied] = useState(false);

  const documents = {
    supplier_contract: {
      title: 'Commercial Supply & Escrow Agreement (PO-8892)',
      subtitle: 'Between Ali Executive Holdings & Shenzhen Precision Electronics Ltd',
      date: 'October 14, 2026',
      content: `COMMERCIAL PURCHASE AGREEMENT & QUALITY ASSURANCE PROTOCOL
Purchase Order Reference: PO-8892
Buyer: Ali Executive Holdings (Founder Account: ah6304993@gmail.com)
Supplier: Shenzhen Precision Electronics Co., Ltd (Alibaba Gold Supplier #8841)

1. PRODUCT SPECIFICATION & BATCH VOLUME
   • Item: 10,000mAh Ultra-Slim MagSafe Magnetic Power Bank (Model: ALI-PB-10K)
   • Initial Trial Quantity: 500 units
   • Agreed Unit Price: $6.20 USD (Net DDP terms exclude local import handling)
   • Packaging: Custom 4-color CMYK box with soft-touch matte finish and EVA foam tray ($0.80/unit)

2. COMPLIANCE & FLIGHT SAFETY CERTIFICATIONS
   • The Supplier warrants that all units strictly comply with CE, FCC, RoHS, UN38.3, and MSDS safety standards.
   • Factory batch test records and MSDS certificates must accompany the air cargo consignment.

3. ESCROW & FINANCIAL PAYMENT SCHEDULE
   • Advance Deposit: 30% ($930.00 USD) released upon contract execution via Alibaba Trade Assurance.
   • Balance Release: 70% ($2,170.00 USD) held in third-party escrow.
   • Release Condition: Full balance will ONLY be released upon submission and Buyer approval of an independent Pre-Shipment Inspection (PSI) report adhering to AQL 1.5 standards.

4. DEFECT REPLACEMENT & WARRANTY
   • The Supplier provides a 14-month replacement warranty for any unit exhibiting battery capacity degradation under 80% or magnetic sensor misalignment.

Authorized Signatory for Buyer:
AI Agent Ali — Autonomous Executive Systems (on behalf of Boss)
Status: Legally Validated • Escrow Bound`,
    },
    feasibility_report: {
      title: 'Executive E-Commerce Feasibility Dossier',
      subtitle: 'Alibaba Sourcing to Amazon US Marketplace Valuation',
      date: 'October 14, 2026',
      content: `EXECUTIVE PRODUCT FEASIBILITY DOSSIER
Niche: Consumer Electronics / Mobile Power Accessories
Target ASIN Category: Portable Wireless Chargers

1. UNIT FINANCIAL BREAKDOWN
   • Landed Sourcing Cost: $9.50 USD (Product $6.20 + Packaging $0.80 + DDP Freight $2.50)
   • Target Selling Price (MSRP): $29.99 USD
   • Amazon Referral Commission (15%): $4.50 USD
   • Amazon FBA Fulfillment Fee: $4.15 USD
   • Allocated Target PPC Ad Spend: $3.50 USD
   • Net Realized Profit per Unit: $8.34 USD
   • Net Operating Margin: 27.81%

2. RISK & REGULATORY AUDIT
   • Battery Transportation: Requires Section II Lithium Battery Label on master cartons.
   • Competition Index: Low saturation in the 15W MagSafe kickstand category.
   • Estimated Daily Run Rate: 18 - 25 units/day during Month 1.

3. EXECUTIVE RECOMMENDATION
   Proceed with initial 500-unit trial run under Alibaba Trade Assurance escrow.`,
    },
    dubbing_cuesheet: {
      title: 'Long-Form Video Localization Master Cue Sheet',
      subtitle: 'Bilingual Timecoded Audio & Subtitle Alignment Schedule',
      date: 'October 14, 2026',
      content: `MASTER VIDEO LOCALIZATION CUE SHEET
Project: 1-Hour Strategy Keynote Localization
Source Language: English (US)
Target Language: Urdu (اردو) / Pakistani Regional Market
Audio Sample Rate: 24,000 Hz Mono (Neural Dubbing Synced)

TIMECODE 00:00:00,000 --> 00:00:04,500
• Source: "Welcome everyone to our global summit on technological autonomy and intelligence."
• Urdu Translation: "ٹیکنالوجی کی خود مختاری اور ذہانت پر ہمارے عالمی سربراہی اجلاس میں آپ سب کو خوش آمدید۔"
• Dubbing Cadence: 1.0x Normal • Pitch: Standard • Speaker: Keynote Lead

TIMECODE 00:00:04,800 --> 00:00:09,200
• Source: "Today we will demonstrate how autonomous executive multi-agent systems operate at scale."
• Urdu Translation: "آج ہم دکھائیں گے کہ کس طرح خود مختار ایگزیکٹو ملٹی ایجنٹ سسٹمز وسیع پیمانے پر کام کرتے ہیں۔"
• Dubbing Cadence: 1.05x Sync • Background Music: -14dB Ducking

TIMECODE 00:00:09,500 --> 00:00:15,000
• Source: "Notice how the planner coordinates research, financial safety, and production without delays."
• Urdu Translation: "غور کریں کہ کس طرح پلانر بغیر کسی تاخیر کے ریسرچ، مالی تحفظ اور پروڈکشن کو مربوط کرتا ہے۔"
• Dubbing Cadence: 1.0x Normal • Speaker: Keynote Lead`,
    },
    app_spec: {
      title: 'Fullstack App Architectural Specification',
      subtitle: 'Voice-First Multi-Agent Autonomous Topology',
      date: 'October 14, 2026',
      content: `SYSTEM ARCHITECTURE SPECIFICATION
Product: AI Agent Ali
Version: 1.0.0 Enterprise Fullstack

1. CORE SYSTEM LAYERS
   • Client Layer: React 19, TypeScript, Tailwind CSS v4, Web Speech API, Web Audio Analyser.
   • Orchestration Server: Express.js proxy with Vite middleware in dev; static distribution in prod.
   • Intelligence Backend: @google/genai TypeScript SDK with gemini-3.8-flash for multi-agent reasoning and gemini-3.8-flash-lite-tts for speech synthesis.
   • Security Enclave: Strict RBAC tenant isolation with explicit Boss authorization gates.

2. MULTI-AGENT WORKFORCE TOPOLOGY
   Executive Planner delegates to 28 specialist workers:
   Business, Supplier, Marketplace, Calculation, Video, Content, Dubbing, Subtitles, Coding, Architecture, Security, Quality.`,
    },
  };

  const currentDoc = documents[selectedDocType];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${currentDoc.title}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
              h1 { font-size: 20px; margin-bottom: 4px; }
              h2 { font-size: 14px; color: #555; margin-top: 0; }
              .meta { font-size: 12px; color: #888; border-bottom: 1px solid #ccc; padding-bottom: 12px; margin-bottom: 24px; }
              pre { white-space: pre-wrap; font-family: monospace; font-size: 13px; background: #f9f9f9; padding: 16px; border: 1px solid #ddd; border-radius: 6px; }
            </style>
          </head>
          <body>
            <h1>${currentDoc.title}</h1>
            <h2>${currentDoc.subtitle}</h2>
            <div class="meta">Generated by AI Agent Ali • Date: ${currentDoc.date} • Confidential Boss Record</div>
            <pre>${currentDoc.content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              LEGAL & OPERATIONAL DOSSIERS
            </span>
            <span className="text-xs text-slate-400">• Document & Compliance Agent</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Executive Document & Contract Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Generates formal supplier trade agreements, product viability dossiers, video dubbing cue sheets, and software architecture specs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Document Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {[
          { id: 'supplier_contract', label: 'Supplier Escrow Agreement', icon: Building },
          { id: 'feasibility_report', label: 'E-Commerce Feasibility', icon: FileCheck },
          { id: 'dubbing_cuesheet', label: 'Video Dubbing Cue Sheet', icon: Layers },
          { id: 'app_spec', label: 'App Architecture Spec', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedDocType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedDocType(tab.id as any)}
              className={`p-3.5 rounded-xl border text-left transition flex items-start gap-2.5 ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-bold text-xs">{tab.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Formal Record</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Document Preview Sheet */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 backdrop-blur-md">
        <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-extrabold text-white">{currentDoc.title}</h3>
            <p className="text-xs text-indigo-300 font-medium">{currentDoc.subtitle}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              {currentDoc.date}
            </span>
          </div>
        </div>

        <pre className="mt-4 p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
          {currentDoc.content}
        </pre>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Official Executive Record for Boss (ah6304993@gmail.com)
          </span>
          <span className="font-mono text-[11px] text-cyan-400">Status: Signed & Verified</span>
        </div>
      </div>
    </div>
  );
};
