import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  Video,
  Copy,
  Check,
  Languages,
  ShieldCheck,
  Clock,
  User,
} from 'lucide-react';

interface MessageEmailDeskProps {
  onTriggerVideoWorkflow: (text: string) => void;
}

export const MessageEmailDesk: React.FC<MessageEmailDeskProps> = ({
  onTriggerVideoWorkflow,
}) => {
  const [incomingMessage, setIncomingMessage] = useState(
    `Hello Founder,
We reviewed your initial order request for 500 units of the MagSafe battery packs. Our standard MOQ is 1,000 units for custom silk-screen logos. However, if you can confirm a 30% advance deposit today and cover sample shipping via DHL ($45), we can make an exception for 500 units at $6.20/pc.
Please let us know by Friday before production slots close.
Best, Lin (Global Sales Manager, Shenzhen Precision Tech)`
  );

  const [messageType, setMessageType] = useState<'message' | 'email'>('email');
  const [copied, setCopied] = useState(false);
  const [replyDraft, setReplyDraft] = useState(
    `Dear Lin,

Thank you for your prompt response and for agreeing to accommodate our initial trial run of 500 units at $6.20 per unit.

We are ready to move forward under the following terms:
1. We will issue the 500-unit Purchase Order (PO-8892) via Alibaba Trade Assurance to safeguard both parties.
2. The 30% advance deposit ($930.00) will be released immediately upon trade contract signing.
3. The remaining 70% balance will be released upon completion of our 3rd-party pre-shipment quality inspection report.
4. Sample air shipping ($45) is approved via DHL Express.

Please generate the Alibaba Trade Assurance contract link referencing PO-8892 and provide the estimated sample tracking number.

Best regards,
Procurement Office — Ali Executive Systems`
  );

  const [urduExplanation, setUrduExplanation] = useState(
    `پیغام کا خلاصہ (Urdu Explanation):
سپلائر (Lin) نے تصدیق کی ہے کہ عام طور پر ان کا کم از کم آرڈر (MOQ) 1000 یونٹس ہوتا ہے، لیکن وہ 500 یونٹس کا آرڈر $6.20 فی یونٹ پر تیار کرنے کے لیے تیار ہیں۔ شرط یہ ہے کہ 30% ایڈوانس ڈپازٹ دیا جائے اور سیمپل کے $45 ڈی ایچ ایل چارجز ادا کیے جائیں۔ جمعہ تک حتمی جواب درکار ہے۔`
  );

  const copyReply = () => {
    navigator.clipboard.writeText(replyDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              MESSAGE & EMAIL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">• Executive Action Agent</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Message Decoding & 1-Click Video Workflow
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Parses urgent intent, provides bilingual Urdu/English explanations, drafts high-stakes counter-offers, or converts message topics directly into viral TikTok video scripts.
          </p>
        </div>

        <button
          onClick={() => onTriggerVideoWorkflow(incomingMessage)}
          className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20 flex items-center gap-2 transition"
        >
          <Video className="w-4 h-4" />
          Convert Message to Video Script
        </button>
      </div>

      {/* Grid: Incoming Message & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Raw Message Input & Urdu Translation (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Inbound Communication Stream
              </h3>
            </div>
            <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[10px]">
              <button
                onClick={() => setMessageType('email')}
                className={`px-2 py-0.5 rounded ${messageType === 'email' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
              >
                Email
              </button>
              <button
                onClick={() => setMessageType('message')}
                className={`px-2 py-0.5 rounded ${messageType === 'message' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
              >
                WhatsApp / DM
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Raw Message Content:
            </label>
            <textarea
              rows={6}
              value={incomingMessage}
              onChange={(e) => setIncomingMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
            />
          </div>

          {/* Bilingual Urdu Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1.5">
              <Languages className="w-4 h-4" />
              Urdu Executive Explanation
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
              {urduExplanation}
            </p>
          </div>
        </div>

        {/* Right Column: Drafted Professional Response (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Executive Counter-Offer & Reply
                </h3>
              </div>
              <button
                onClick={copyReply}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Response'}
              </button>
            </div>

            <textarea
              rows={10}
              value={replyDraft}
              onChange={(e) => setReplyDraft(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              External sending requires explicit Boss authorization.
            </span>
            <button
              onClick={copyReply}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
            >
              Ready to Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
