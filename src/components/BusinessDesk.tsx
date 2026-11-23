import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Send,
  Sparkles,
  Calculator,
  Building2,
  Tag,
  ArrowRight,
  ListChecks,
  PieChart,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export const BusinessDesk: React.FC = () => {
  // Interactive unit economics state
  const [sourcingPrice, setSourcingPrice] = useState<number>(6.2);
  const [packagingCost, setPackagingCost] = useState<number>(0.8);
  const [shippingDDP, setShippingDDP] = useState<number>(2.5);
  const [sellingPrice, setSellingPrice] = useState<number>(29.99);
  const [fbaFee, setFbaFee] = useState<number>(4.15);
  const [adSpend, setAdSpend] = useState<number>(3.5);
  const [batchQuantity, setBatchQuantity] = useState<number>(500);

  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'comparator' | 'checklist' | 'payouts'>('calculator');

  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedListing, setCopiedListing] = useState(false);

  // Derived financial calculations
  const landedCost = sourcingPrice + packagingCost + shippingDDP;
  const referralFee = Number((sellingPrice * 0.15).toFixed(2));
  const totalCostPerUnit = landedCost + referralFee + fbaFee + adSpend;
  const netProfitPerUnit = Number((sellingPrice - totalCostPerUnit).toFixed(2));
  const profitMarginPct = Number(((netProfitPerUnit / sellingPrice) * 100).toFixed(1));
  const totalBatchInvestment = Number((landedCost * batchQuantity).toFixed(2));
  const totalBatchEstimatedProfit = Number((netProfitPerUnit * batchQuantity).toFixed(2));
  const breakevenUnits = Math.ceil(totalBatchInvestment / (sellingPrice - (referralFee + fbaFee + adSpend)));

  // Candidate products comparator
  const candidateProducts = [
    {
      name: 'MagSafe Magnetic Power Bank (10,000mAh)',
      sourcing: '$6.20',
      shipping: '$2.50',
      amazonPrice: '$29.99',
      margin: '27.8%',
      demand: 'Very High',
      competition: 'Medium',
      recommended: true,
    },
    {
      name: 'Ergonomic Vertical Wireless Mouse',
      sourcing: '$4.10',
      shipping: '$1.80',
      amazonPrice: '$21.99',
      margin: '24.2%',
      demand: 'Medium',
      competition: 'High',
      recommended: false,
    },
    {
      name: 'Smart 2K Solar Security Camera',
      sourcing: '$18.50',
      shipping: '$5.20',
      amazonPrice: '$59.99',
      margin: '31.5%',
      demand: 'High',
      competition: 'Very High',
      recommended: false,
    },
  ];

  // Amazon FBA Launch Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Order 2 samples from top 2 Alibaba Gold Suppliers for stress testing', done: true },
    { id: 2, text: 'Validate CE, FCC, RoHS, UN38.3 battery flight compliance certificates', done: true },
    { id: 3, text: 'Create Alibaba Trade Assurance contract with 30% advance deposit', done: false },
    { id: 4, text: 'Generate GS1 official UPC barcode and assign Amazon FNSKU labels', done: false },
    { id: 5, text: 'Prepare 7 high-resolution product photography renders + 3D exploded view', done: false },
    { id: 6, text: 'Book 3rd-party pre-shipment quality inspection before releasing remaining 70%', done: false },
    { id: 7, text: 'Create Amazon Inbound Shipping Plan for DDP Air Freight to FBA warehouse', done: false },
    { id: 8, text: 'Set up Exact-Match PPC Campaign + enroll first 30 units in Amazon Vine', done: false },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const supplierRfqLetter = `Subject: RFQ: 500-2,500 Units OEM Ergonomic Magnetic Power Bank - [Ali Holdings]

Dear Sales Director,

We are an international e-commerce brand operating on Amazon US and regional marketplaces. We are sourcing a high-reliability supplier for a 10,000mAh Ultra-Slim MagSafe Magnetic Power Bank.

Please provide your best quotation based on the following specifications:
1. Product: 10,000mAh Magnetic Wireless Power Bank (20W PD Type-C, Qi-compatible)
2. Certifications: CE, FCC, RoHS, UN38.3, MSDS (Required for Amazon FBA compliance)
3. Initial Trial Order: 500 units with custom logo silk-screen printing
4. Production Order: 1,000 to 2,500 units tiered pricing
5. DDP Air Express shipping quote to Amazon Fulfillment Center in California, US
6. Sample lead time and turnaround for customized packaging mockup.

We require payment processing exclusively via Alibaba Trade Assurance. 

Looking forward to your swift response so we can issue the sample purchase order.

Best regards,
Procurement Desk — AI Agent Ali Systems`;

  const amazonListing = `TITLE:
Ultra-Slim MagSafe Magnetic Power Bank 10000mAh – Fast 20W PD Wireless Portable Charger with Foldable Kickstand for iPhone 15/14/13/12 Series & Qi Devices

KEY BULLET POINTS:
• [SNAP-AND-GO 15W WIRELESS CHARGING] Powerful 1200GS neodymium magnets lock firmly onto your phone without slipping or misalignment during travel.
• [HIGH-CAPACITY 10,000MAH IN SLIM PROFILE] Provides 2.2 full charges for iPhone 15 Pro, keeping you powered through entire workdays and transatlantic flights.
• [BIDIRECTIONAL 20W USB-C POWER DELIVERY] Charge the power bank to 80% in only 45 minutes or rapidly wire-charge any secondary USB-C smartphone simultaneously.
• [INTELLIGENT DUAL-LAYER GRAPHENE COOLING] Advanced NTC thermal sensors prevent overheating and protect device battery health during fast charging cycles.
• [FLIGHT APPROVED & CERTIFIED SAFE] Compliant with FAA & TSA air travel standards. Certified CE, FCC, and RoHS with built-in surge and overcharge protection.

SEARCH BACKEND KEYWORDS:
magsafe battery pack portable charger 10000mah wireless power bank iphone magnetic battery ultra slim fast charging kickstand travel accessories`;

  const copyToClipboard = (text: string, type: 'letter' | 'listing') => {
    navigator.clipboard.writeText(text);
    if (type === 'letter') {
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    } else {
      setCopiedListing(true);
      setTimeout(() => setCopiedListing(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-cyan-950/30 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ALIBABA ➔ AMAZON ARBITRAGE
            </span>
            <span className="text-xs text-slate-400">• Executive Business Agent</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Product Sourcing & Profit Margin Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live unit economics modeling. Clearly distinguishes between verified fee tiers and market assumptions before capital allocation.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Batch Profit</div>
            <div className="text-lg font-black text-emerald-400">
              +${totalBatchEstimatedProfit.toLocaleString()}
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Net Margin</div>
            <div className={`text-lg font-black ${profitMarginPct >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {profitMarginPct}%
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeSubTab === 'calculator'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unit Economics & RFQ
        </button>
        <button
          onClick={() => setActiveSubTab('comparator')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeSubTab === 'comparator'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Product Comparator (3 Items)
        </button>
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeSubTab === 'checklist'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Amazon Launch Checklist ({checklist.filter((c) => c.done).length}/8)
        </button>
        <button
          onClick={() => setActiveSubTab('payouts')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeSubTab === 'payouts'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Reconciled Payout Records
        </button>
      </div>

      {/* TAB 1: Calculator & RFQ */}
      {activeSubTab === 'calculator' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Calculator (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Unit Cost & Revenue Modeler
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-teal-400">
                    <span className="w-2 h-2 rounded-full bg-teal-400" /> Live Rates
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Assumptions
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Alibaba Sourcing Price ($)</span>
                    <span className="text-[10px] text-teal-400 font-mono">Verified Supplier</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={sourcingPrice}
                    onChange={(e) => setSourcingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Custom OEM Packaging ($)</span>
                    <span className="text-[10px] text-amber-400 font-mono">Estimate</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>DDP Air Express / Unit ($)</span>
                    <span className="text-[10px] text-teal-400 font-mono">Freight Rate</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={shippingDDP}
                    onChange={(e) => setShippingDDP(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Amazon Selling Price ($)</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Target MSRP</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-cyan-800/80 rounded-lg p-2 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Amazon FBA Pick & Pack ($)</span>
                    <span className="text-[10px] text-teal-400 font-mono">Standard Weight</span>
                  </div>
                  <input
                    type="number"
                    step="0.05"
                    value={fbaFee}
                    onChange={(e) => setFbaFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Target PPC Ad Cost / Unit ($)</span>
                    <span className="text-[10px] text-amber-400 font-mono">Launch Phase</span>
                  </div>
                  <input
                    type="number"
                    step="0.25"
                    value={adSpend}
                    onChange={(e) => setAdSpend(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quantity Batch Slider */}
              <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-bold">Initial Batch Order Quantity:</span>
                  <span className="text-cyan-400 font-mono font-bold">{batchQuantity} units</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={batchQuantity}
                  onChange={(e) => setBatchQuantity(parseInt(e.target.value) || 100)}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Financial Metrics Summary Strip */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Landed Cost</div>
                  <div className="text-sm font-mono font-black text-white mt-0.5">
                    ${landedCost.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Amazon Fees</div>
                  <div className="text-sm font-mono font-black text-amber-300 mt-0.5">
                    ${(referralFee + fbaFee).toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Net Profit / Unit</div>
                  <div className={`text-sm font-mono font-black mt-0.5 ${netProfitPerUnit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${netProfitPerUnit}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Breakeven Volume</div>
                  <div className="text-sm font-mono font-black text-cyan-400 mt-0.5">
                    {breakevenUnits} units
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sourcing Status & Supplier Vetting (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Alibaba Supplier Screening
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                      <span>Shenzhen AnkerTech Electronics Ltd</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        8 Yrs Gold
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <p>• Trade Assurance: $500,000+ Escrow Coverage</p>
                      <p>• Verified Certifications: CE, FCC, RoHS, UN38.3</p>
                      <p>• Response Rate: 98.4% (Avg &lt; 2 hours)</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                      <span>Dongguan PowerMax Innovation Co.</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        6 Yrs Gold
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <p>• ISO9001 certified manufacturing plant</p>
                      <p>• Sample Cost: $25 (Refundable on PO)</p>
                      <p>• Production Lead Time: 14 business days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Payment Escrow: 100% protection via Trade Assurance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables: RFQ Letter & Amazon Listing Blueprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Supplier RFQ & Negotiation Draft
                  </h4>
                </div>
                <button
                  onClick={() => copyToClipboard(supplierRfqLetter, 'letter')}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
                >
                  {copiedLetter ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLetter ? 'Copied' : 'Copy RFQ'}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {supplierRfqLetter}
              </pre>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Amazon FBA Optimized Listing Blueprint
                  </h4>
                </div>
                <button
                  onClick={() => copyToClipboard(amazonListing, 'listing')}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
                >
                  {copiedListing ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedListing ? 'Copied' : 'Copy Listing'}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {amazonListing}
              </pre>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: Product Comparator */}
      {activeSubTab === 'comparator' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Amazon FBA Product Viability Matrix (3 Candidate Niches)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Product Candidate</th>
                  <th className="py-3 px-3">Alibaba Unit</th>
                  <th className="py-3 px-3">DDP Shipping</th>
                  <th className="py-3 px-3">Amazon Retail</th>
                  <th className="py-3 px-3">Net Margin</th>
                  <th className="py-3 px-3">Market Demand</th>
                  <th className="py-3 px-3">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {candidateProducts.map((p, idx) => (
                  <tr key={idx} className={p.recommended ? 'bg-emerald-950/20' : ''}>
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                      {p.recommended && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                      {p.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-teal-400">{p.sourcing}</td>
                    <td className="py-3 px-3 font-mono">{p.shipping}</td>
                    <td className="py-3 px-3 font-mono text-cyan-300 font-bold">{p.amazonPrice}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-extrabold">{p.margin}</td>
                    <td className="py-3 px-3">{p.demand}</td>
                    <td className="py-3 px-3">
                      {p.recommended ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Primary Pick (Best Margin)
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Secondary Option</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Amazon Launch Checklist */}
      {activeSubTab === 'checklist' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-cyan-400" />
              Executive 8-Step Launch Checklist
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {checklist.filter((c) => c.done).length} / {checklist.length} Complete
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  item.done
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                )}
                <span className={`text-xs ${item.done ? 'line-through text-slate-400' : 'font-medium'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Reconciled Payout Records (Section 17) */}
      {activeSubTab === 'payouts' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                Profit & Business Reconciled Records
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Clearly distinguishes estimated projected profit from realized deposited money.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-bold">
              Net Realized: $14,892.40 USD
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 uppercase text-[10px] font-bold">Gross Disbursed Revenue</div>
              <div className="text-xl font-bold font-mono text-white mt-1">$48,220.00</div>
              <div className="text-[10px] text-teal-400 mt-1">Amazon Seller Central Payouts</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 uppercase text-[10px] font-bold">Total COGS & Logistics</div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1">-$21,450.60</div>
              <div className="text-[10px] text-rose-300 mt-1">Alibaba Sourcing + DDP Air Freight</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 uppercase text-[10px] font-bold">Amazon FBA & PPC Fees</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">-$11,877.00</div>
              <div className="text-[10px] text-amber-300 mt-1">Fulfillment + Sponsored Ads</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Payout Destination: Primary Business Operating Account (*4910)</span>
            <span className="text-teal-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Destination Locked (Zero Silent Changes)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
